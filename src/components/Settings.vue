<template>
  <div class="settings" :key="componentKey">
    <div class="row">
      <div class="col-10">
        <h4 class="title">Tags </h4>
      </div>
      <div class="col-2 savebtn">
        <button type="button" v-if="changed" class="btn btn-secondary btn-circle add" @click="save">
          <i class="fas fa-save"></i>
        </button>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-3">
        <input class="form-control" v-model="name" placeholder="Tag name" />
      </div>
      <div class="col-7">
        <input class="form-control" v-model="desc" placeholder="Description" />
      </div>
      <div class="col-2">
        <button type="button" :disabled="name==''" class="btn btn-primary add" @click="newTag">
          <i class="fas fa-plus-square"></i>
          Add
        </button>
      </div>
    </div>
    <div class="row" v-if="tags.length > 0">
      <div :class="updateMode? 'col-8' : 'col-12'">
        <ul class="list-group">
          <li class="list-group-item" :key="tag.name" v-for="tag in tags">
            <span class="badge">{{tag.name}}</span>
            <span class="desc">{{tag.desc}}</span>
            <button type="button" class="delete" v-if="tag.new" @click="deleteTag(tag.name)">
              <span aria-hidden="true">&times;</span>
            </button>
            <button type="button" class="update" v-if="!updateMode" @click="updateCard(tag)">
              <i class="fas fa-pen"></i>
            </button>
          </li>
        </ul>
      </div>
      <div class="col-4" v-if="updateMode">
        <div class="card">
          <input
            class="form-control updateInput"
            :disabled="!updatedTag.new"
            v-model="updatedTag.name"
            placeholder="Tag name"
          />
          <input
            class="form-control updateInput"
            v-model="updatedTag.desc"
            placeholder="Description"
          />
          <div class="button-box">
            <button type="button" class="btn btn-primary btn-sm" @click="completeUpdate()">
              <i class="fas fa-save"></i>
              Save
            </button>
            <button type="button" class="btn cancel btn-sm" @click="updateMode = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <div class="empty" v-else>
      <hr />
      <p>
        <i class="fas fa-tag"></i> No tags yet...
      </p>
      <hr />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "TablesFeed",
  data() {
    return {
      name: "",
      desc: "",
      initTags: [],
      updateMode: false,
      updatedTag: {},
      oldTagName: "",
      componentKey: 0
    };
  },
  created() {
    this.initTags = JSON.parse(JSON.stringify(this.tags));
  },
  computed: {
    ...mapState("tables", ["tags"]),
    changed() {
      return JSON.stringify(this.initTags) != JSON.stringify(this.tags);
    }
  },
  methods: {
    // ...mapActions("tables", ["saveTags"]),
    ...mapActions("tables", ["saveTags"]),
    ...mapMutations("tables", {
      addTag: "ADD_TAG",
      deleteTag: "DELETE_TAG",
      updateTag: "UPDATE_TAG"
    }),
    newTag() {
      if (this.tags.filter(tag => tag.name == this.name).length > 0) {
        this.$toasted.show("Choose a different tag name!");
      } else {
        this.addTag({ name: this.name, desc: this.desc, new: true });
        this.name = "";
        this.desc = "";
      }
    },
    updateCard(tag) {
      this.updateMode = true;
      this.oldTagName = tag.name;
      this.updatedTag = JSON.parse(JSON.stringify(tag));
    },
    completeUpdate() {
      this.updateTag({ oldName: this.oldTagName, tagData: this.updatedTag });
      this.updateMode = false;
    },
    async save() {
      try {
        await this.saveTags();
        this.componentKey += 1;
        this.initTags = JSON.parse(JSON.stringify(this.tags));  
        this.$toasted.show(`Changes were saved!`, {
          icon: "fa-check",
          className: "customSuccessToast"
        });
      } catch (error) {
        this.$toasted.show("Could not save changes");
      }
    }
  }
};
</script>
<style scoped>
.empty p {
  text-align: center !important;
  color: rgb(145, 145, 145);
}

.badge {
  font-size: 14px;
}

.savebtn {
  padding-top: 3%;
}

.settings {
  width: 90%;
  margin: auto;
}

.add {
  float: right;
  font-size: 13px;
}

.desc {
  font-size: 13px;
  color: #696969;
  margin-left: 10px;
  text-align: center;
}

.title {
  margin-top: 3%;
  color: #696969;
}

.delete,
.update {
  float: right;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
  color: rgb(139, 139, 139);
  height: 30px !important;
  padding: 6px 2px !important;
  position: absolute;
  background: none;
}

.delete {
  right: 10px;
  top: 10px;
}

.update {
  right: 35px;
  top: 10px;
  font-size: 13px;
}

.update:hover,
.delete:hover {
  color: rgb(97, 97, 97) !important;
}

.card {
  padding: 3%;
}

.updateInput {
  margin-bottom: 3% !important;
}
</style>