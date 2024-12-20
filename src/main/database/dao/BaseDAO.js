class BaseDAO {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    console.log('BaseDAO create', data);
    return await this.model.create(data);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findAll(query = {}) {
    return await this.model.find(query);
  }

  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseDAO;
