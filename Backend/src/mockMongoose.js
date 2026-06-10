const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'db_data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

function getCollectionFile(name) {
    // lowercase name + s for standard plural file name (e.g. reels.json, users.json)
    return path.join(dbDir, `${name.toLowerCase()}s.json`);
}

function loadCollection(name) {
    const file = getCollectionFile(name);
    if (!fs.existsSync(file)) return [];
    try {
        const content = fs.readFileSync(file, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        console.error(`Error reading mock DB collection ${name}:`, err);
        return [];
    }
}

function saveCollection(name, data) {
    const file = getCollectionFile(name);
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing mock DB collection ${name}:`, err);
    }
}

class MockModel {
    constructor(data) {
        Object.assign(this, data);
        if (!this._id) {
            this._id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        }
        if (!this.createdAt) {
            this.createdAt = new Date().toISOString();
        }
        if (!this.updatedAt) {
            this.updatedAt = new Date().toISOString();
        }
    }

    async save() {
        const name = this.constructor.modelName;
        const items = loadCollection(name);
        const index = items.findIndex(item => String(item._id) === String(this._id));
        
        // Remove methods/getters/setters before saving
        const doc = { ...this };
        delete doc.save;
        
        doc.updatedAt = new Date().toISOString();
        
        if (index > -1) {
            items[index] = doc;
        } else {
            items.push(doc);
        }
        saveCollection(name, items);
        return this;
    }

    static async findOne(query) {
        const items = loadCollection(this.modelName);
        const found = items.find(item => {
            for (let key in query) {
                if (String(item[key]) !== String(query[key])) return false;
            }
            return true;
        });
        return found ? new this(found) : null;
    }

    static async findById(id) {
        const items = loadCollection(this.modelName);
        const found = items.find(item => String(item._id) === String(id));
        return found ? new this(found) : null;
    }

    static async find(query = {}) {
        const items = loadCollection(this.modelName);
        const filtered = items.filter(item => {
            for (let key in query) {
                if (String(item[key]) !== String(query[key])) return false;
            }
            return true;
        }).map(item => new this(item));

        // Add support for chainable populate('user')
        filtered.populate = function(pathStr, fieldsStr) {
            if (pathStr === 'user') {
                const users = loadCollection('user');
                filtered.forEach(item => {
                    const u = users.find(user => String(user._id) === String(item.user));
                    if (u) {
                        item.user = {
                            _id: u._id,
                            fullName: u.fullName,
                            email: u.email
                        };
                    }
                });
            }
            return this;
        };
        return filtered;
    }

    static async create(data) {
        const inst = new this(data);
        return await inst.save();
    }
}

const mongooseMock = {
    connect: async () => {
        console.log("✅ Mock DB Connected (Local JSON Storage)");
        return true;
    },
    Schema: class Schema {
        constructor(definition, options) {
            this.definition = definition;
            this.options = options;
        }
    },
    model: function(name, schema) {
        // Create a unique subclass so modelName is distinct
        const ModelClass = class extends MockModel {};
        ModelClass.modelName = name;
        return ModelClass;
    }
};

mongooseMock.Schema.Types = {
    ObjectId: String
};

module.exports = mongooseMock;
