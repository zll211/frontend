<template>
  <div class="upload-report flex wrap">
    <div class="img-content" v-for="(item,key) in imgList" :key="key" :data-key="key" draggable="true"
         @dragstart="dragstart"
         @dragover="dragover"
         @dragend="dragend">
      <div class="viewer-img">
        <img :src="item.url">
      </div>
      <!-- 删除icon -->
      <div class="del" v-if="!readonly" title="删除">
        <i @click="handleFileRemove(item,key)" class="el-icon-delete"></i>
      </div>
    </div>
    <div>
      <video autoplay ref="video" width="150" height="120" id="video"
             style="border: 1px dashed #ccc;margin-left: 10px; border-radius: 5px;"></video>
      <canvas style="display:none;" ref="canvas" width="150" height="120"></canvas>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'gallery',
    data() {
      return {
        draging: undefined,
        current: undefined,
      };
    },
    props: {
      imgList: {
        type: Array,
        default: () => [],
      },
      type: '',
      readonly: false,
    },
    created() {
    },
    methods: {
      saveDes(item) {
        this.$emit('save-des', item);
      },
      handleFileRemove(file, key) {
        this.$emit('handle-file-remove', file, key);
      },
      reportImgCheckedChange(item, type) {
        this.$emit('report-img-checked-change', item, type);
      },
      getParentNode(traget) {
        if (traget.classList.contains('img-content')) {
          return traget;
        } else if (traget.classList.contains('upload-report')) {
          return null;
        } else {
          return this.getParentNode(traget.parentElement);
        }
      },
      dragstart(event) {
        event.dataTransfer.setData('te', event.target.innerText); //不能使用text，firefox会打开新tab
        //event.dataTransfer.setData("self", event.target);
        this.draging = this.getParentNode(event.target);
      },
      dragover(event) {
        event.preventDefault();
        const target = this.getParentNode(event.target);
        if (target !== this.draging) {
          this.current = target;
        }
      },
      dragend() {
        const currentKey = this.current.getAttribute('data-key');
        const dragingKey = this.draging.getAttribute('data-key');
        this.$emit('move-img', currentKey, dragingKey);
      },
    },
  };
</script>

<style scoped lang="scss">
  .upload-report {
    position: relative;
    min-height: 150px;
    border: 1px solid #dcdfe6;
    padding: 10px 15px;
    border-radius: 4px;
    background-color: #F8F8F8;
    .img-content {
      float: left;
      text-align: left;
      position: relative;
      display: inline-block;
      width: 150px;
      max-height: 153px;
      margin: 0 10px 5px;
      border: 1px solid #d1dbe5;
      border-radius: 4px;
      transition: all .3s;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      img {
        width: 150px;
        height: 120px;
      }
      .del {
        .el-icon-delete {
          position: absolute;
          top: 0;
          right: -17px;
          color: red;
          cursor: pointer;
          font-size: 18px;
        }
      }
      .report-img-check {
        position: absolute;
        top: 18px;
        right: -15px;
        color: red;
        cursor: pointer;
        .el-checkbox__inner {
          border: 1px solid #01d0b0;
        }
      }
    }
    .viewer-img {
      cursor: pointer;
    }
  }
</style>
