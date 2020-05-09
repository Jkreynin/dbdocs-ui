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
  loadMoreCounter: 0,
  alert: "",
  undocFilterActive: false
}

const getters = {

  filteredTables(state) {
    let currFilter = state.filterText.toLowerCase();
    let filterResult = state.tables.filter(table =>
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
    return ((Math.round(getters.haveDocs) * 100) / Math.round(fixedTotal)).toFixed(1);
  },
  initResultsAmount(state) {
    return state.readMode ? 3 : 18
  },
  loadMoreAmount(state) {
    return state.readMode ? 2 : 9
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
  async loadSingleTable({ commit }, data) {
    let result = await api.getTable(data.schema, data.name)
    commit('SET_CURR_TABLE', result.data)
  },
  async updateTable({ commit }, data) {
    await api.updateTable(data.table)
    commit('SET_TABLE', data.table)
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

  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}