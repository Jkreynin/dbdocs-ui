/* eslint-disable prettier/prettier */
import Vue from "vue";
import * as api from "../../api"
const state = {
  filterText: "",
  filterTags: [],
  readMode: false,
  currTable: {},
  tables: [],
  tags: [],
  schemas: [],
  loadMoreCounter: 0,
  alert: "",
  undocFilterActive: false,
  arcFilter: ""
}

const getters = {

  filteredTables(state) {
    let relevantTables = state.tables.filter(table =>
      state.schemas.filter(schema => schema.active)
        .map(schema => schema.name).includes(table.schema)
    ).filter(table => table.is_deleted == false)

    let currFilter = state.filterText.toLowerCase();

    let filterResult = relevantTables.filter(table =>
      (table.name.toLowerCase().includes(currFilter) ||
        table.desc.toLowerCase().includes(currFilter) ||
        (state.readMode &&
          table.columns
            .map(column => column.name.toLowerCase())
            .filter(name => name.includes(currFilter)).length > 0)) &&
      state.filterTags.every(val => table.tags.includes(val)))

    if (state.undocFilterActive) {
      return filterResult.filter(table => table.desc == "" || table.tags.length == 0);
    }

    return filterResult;
  },
  deletedTables(state) {
    return state.tables.filter(table => table.is_deleted == true && table.name.includes(state.arcFilter));
  },
  tableByID: state => (name, schema) => {
    return state.tables.filter(table => table.name == name && table.schema == schema)[0];
  },
  haveDocs(state) {
    return state.tables.filter(table => table.desc != '' && table.tags.length > 0).length;
  },
  total(state) {
    return state.tables.length;
  },
  coverage: (state, getters) => {
    let fixedTotal = (!getters.total) ? 1 : getters.total;
    return parseFloat(((Math.round(getters.haveDocs) * 100) / Math.round(fixedTotal)).toFixed(1));
  },
  initResultsAmount(state) {
    return state.readMode ? 3 : 18
  },
  loadMoreAmount(state) {
    return state.readMode ? 2 : 9
  },
  tagsArray(state) {
    return state.tags.map(tag => tag.name);
  }
}

const actions = {
  async loadTables({ commit }) {
    let result = await api.getTables()
    commit('SET_TABLES', result.data)
  },
  async loadTags({ commit }) {
    let result = await api.getTags()
    commit('SET_TAGS', result.data)
  },
  async loadSchemas({ commit }) {
    let result = await api.getSchemas()
    commit('SET_SCHEMAS', result.data)
  },
  async loadSingleTable({ commit }, data) {
    let result = await api.getTable(data.schema, data.name)
    commit('SET_CURR_TABLE', result.data)
  },
  async updateTable({ commit }, data) {
    await api.updateTable(data.table)
    commit('SET_TABLE', data.table)
  },
  async changeTableStatus({ commit }, data) {
    await api.changeTableStatus(data.schema, data.name, data.status)
    commit('CHANGE_TABLE_STATUS', data)
  },
  async saveTags({ commit, state }) {
    state.tags.forEach(tag => delete tag.new);
    await api.saveTags(state.tags);
  }
}

const mutations = {
  SET_TABLES(state, tables) {
    state.tables = tables
  },
  SET_LOAD_MORE_COUNTER(state, count) {
    state.loadMoreCounter = count;
  },
  SET_TAGS(state, tags) {
    state.tags = tags
  },
  SET_SCHEMAS(state, initSchemas) {
    if (state.schemas.length == 0) {
      initSchemas.forEach(element => {
        state.schemas.push({ name: element.name, active: element.default ? true : false })
      });
    }
  },
  SET_SCHEMA(state, currSchema) {
    let schemaIndex = state.schemas.findIndex((schema => schema.name == currSchema.name));
    Vue.set(state.schemas, schemaIndex, currSchema);
  },
  SET_ARC_FILTER(state, arcFilter) {
    state.arcFilter = arcFilter
  },
  SET_FILTER_TEXT(state, filterText) {
    state.filterText = filterText
  },
  SET_FILTER_TAGS(state, filterTags) {
    state.filterTags = filterTags
  },
  SET_READ_MODE(state, readMode) {
    state.readMode = readMode
  },
  SET_CURR_TABLE(state, currTable) {
    state.currTable = currTable
  },
  SET_UNDOC_FILTER(state, undocFilterActive) {
    state.undocFilterActive = undocFilterActive
  },
  SET_TABLE(state, currTable) {
    let tableIndex = state.tables.findIndex((table => table.name == currTable.name));
    Vue.set(state.tables, tableIndex, currTable);
  },
  ADD_TAG(state, newTag) {
    state.tags.push(newTag);
  },
  DELETE_TAG(state, delTagName) {
    let tagIndex = state.tags.findIndex((tag => tag.name == delTagName));
    if (tagIndex !== -1) {
      state.tags.splice(tagIndex, 1);
    }
  },
  CHANGE_TABLE_STATUS(state, tableData) {
    let tableIndex = state.tables.findIndex((table => table.name == tableData.name && table.schema == tableData.schema));
    if (tableIndex !== -1) {
      if (tableData.status.type == 'deleted') {
        state.tables.splice(tableIndex, 1);
      } else {
        state.tables[tableIndex].is_deleted = false;
      }
    }
  },
  UPDATE_TAG(state, updateData) {
    let tagIndex = state.tags.findIndex((tag => tag.name == updateData.oldName));
    Vue.set(state.tags, tagIndex, updateData.tagData);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}