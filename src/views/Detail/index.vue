<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime : 2020-01-30 16:57:06
 -->
<template>
  <div id="ShopDetail">
    <!-- 地址选择  -->
    <Popup v-model="showPicker" position="bottom">
      <Picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </Popup>

    <NavBar left-arrow left-text="返回" @click-left="onClickLeft" title="商品详情" />
    <Swipe
      v-if="goodInfo"
      style="height: 380px;margin-top:-15px"
      :autoplay="3000"
      indicator-color="white"
    >
      <SwipeItem v-for="(item,index) in goodImages" :key="index">
        <van-image width="100%" height="100%" lazy-load :src="item" />
      </SwipeItem>
    </Swipe>

    <section class="intor">
      <Panel
        v-if="goodInfo"
        :title="goodInfo.name"
        :desc="`上架时间：${goodInfo.createtime}`"
        :status="`￥${goodInfo.price}`"
      ></Panel>
    </section>

    <div class="page-inner">
      <Divider>商品详情</Divider>

      <div v-if="goodInfo" class="rich-text" v-html="goodInfo.content"></div>
    </div>

    <GoodsAction>
      <GoodsActionIcon icon="shop-o" text="店铺" />
      <GoodsActionIcon
        v-if="goodInfo&&goodInfo.is_favorite"
        @click="editGoodsFavorite(0)"
        icon="star"
        text="已收藏"
        color="#ff5000"
      />
      <GoodsActionIcon
        v-if="goodInfo&&!goodInfo.is_favorite"
        icon="star-o"
        @click="editGoodsFavorite(1)"
        text="收藏"
      />
      <!-- <GoodsActionButton type="warning" text="加入购物车" /> -->
      <GoodsActionButton @click="showSku" type="danger" text="立即购买" />
    </GoodsAction>

    <!-- sku  -->

    <Sku
      v-model="skuShow"
      stepper-title="我要买"
      :sku="sku"
      :goods="goods"
      :show-add-cart-btn="false"
      close-on-click-overlay
      reset-stepper-on-hide
      @buy-clicked="onBuyClicked"
    >
      <template slot="sku-messages">
        <!-- 收货地址 -->
        <Field
          readonly
          clickable
          label="选择地址"
          :value="address"
          @click="showPicker = true"
          placeholder="请选择地址"
        />

        <Field
          v-model="message"
          rows="3"
          autosize
          label="留言"
          type="textarea"
          placeholder="请输入留言"
          show-word-limit
        />
      </template>
    </Sku>
  </div>
</template>

<script>
import { goodsInfo, goodsFavorite, myAddress, createOrder } from "@/axios/api.js";
import {
  NavBar,
  Swipe,
  SwipeItem,
  Button,
  Panel,
  Divider,
  GoodsAction,
  GoodsActionButton,
  GoodsActionIcon,
  Sku,
  Toast,
  Field,
  Popup,
  Picker
} from 'vant';
export default {
  name: 'ShopDetail',
  components: {
    NavBar,
    Swipe,
    SwipeItem,
    Button,
    Panel,
    Divider,
    GoodsAction,
    GoodsActionButton,
    GoodsActionIcon,
    Sku,
    Field,
    Popup,
    Picker
  },
  computed: {
    goodImages () {
      if (this.goodInfo) {
        return this.goodInfo.images.split(',')
      }
    }
  },
  created () {
    // component init
    this.getGoodsInfo()
  },
  data () {
    return {
      showPicker: false,
      message: '',
      columns: [],
      address: '',
      addressId: '',
      goodInfo: null,
      skuShow: false,
      goods: {
        // 商品标题
        title: 'asd',
        // 默认商品 sku 缩略图
        picture: 'asd'
      },
      sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [
          {
            k: '颜色', // skuKeyName：规格类目名称
            v: [
              {
                id: '30349', // skuValueId：规格值 id
                name: '红色', // skuValueName：规格值名称
                imgUrl: 'https://img.yzcdn.cn/1.jpg', // 规格类目图片，只有第一个规格类目可以定义图片
                previewImgUrl: 'https://img.yzcdn.cn/1p.jpg', // 用于预览显示的规格类目图片
              },
              {
                id: '1215',
                name: '蓝色',
                imgUrl: 'https://img.yzcdn.cn/2.jpg',
                previewImgUrl: 'https://img.yzcdn.cn/2p.jpg',
              }
            ],
            k_s: 's1' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
          }
        ],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [
          {
            id: 2259, // skuId，下单时后端需要
            price: 100, // 价格（单位分）
            s1: '1215', // 规格类目 k_s 为 s1 的对应规格值 id
            s2: '1193', // 规格类目 k_s 为 s2 的对应规格值 id
            s3: '0', // 最多包含3个规格值，为0表示不存在该规格
            stock_num: 110 // 当前 sku 组合对应的库存
          }
        ],
        price: '1.00', // 默认价格（单位元）
        stock_num: 227, // 商品总库存
        collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: true, // 是否无规格商品
        hide_stock: false // 是否隐藏剩余库存
      }
    }
  },
  methods: {
    //  methods init 
    onClickLeft () {
      this.$router.go(-1)
    },
    async onBuyClicked (e) {
      let params = {
        id: this.$route.params.id,
        num: e.selectedNum,
        address_id: this.addressId,
        ps: this.message
      }
      try {
        let res = await createOrder(params)
        this.$router.replace({
          name: 'shop-mygoods',
          params: {
            index: 0,
            goodId: this.$route.params.id
          }
        })
        Toast.success(res.msg)
      } catch (error) {
        console.log(error);
      }
    },
    showSku () {
      this.skuShow = true
      this.getAddressList()
    },
    /* 获取收货地址 */
    async getAddressList () {
      try {
        let res = await myAddress()
        this.columns = res.data.map(item => {
          let addressObj = {
            value: item.id,
            text: `${item.username} ${item.area} ${item.info}`
          }
          if (item.is_default == '1') {
            this.addressId = addressObj.value
            this.address = addressObj.text
          }
          return addressObj
        })
      } catch (error) {
        console.log(error);
      }
    },
    onConfirm (value) {
      this.address = value.text;
      this.addressId = value.value
      this.showPicker = false;
    },
    async editGoodsFavorite (type) {
      try {
        let params = {
          goods_id: this.$route.params.id,
          is_favorite: type
        }
        let res = await goodsFavorite(params)
        Toast.success(res.msg)
        this.getGoodsInfo()
      } catch (error) {
        console.log(error)
      }
    },
    async getGoodsInfo () {
      try {
        let params = {
          id: this.$route.params.id
        }
        let res = await goodsInfo(params)
        this.goodInfo = res.data
        this.goods = {
          title: res.data.name,
          picture: res.data.image
        }
        this.sku.price = res.data.price
        this.sku.stock_num = res.data.num
      } catch (error) {
        this.$router.go(-1)
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>