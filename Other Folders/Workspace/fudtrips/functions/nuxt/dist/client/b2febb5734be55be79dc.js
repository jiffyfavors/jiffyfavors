(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{484:function(t,e,o){"use strict";o.r(e);var n=o(132),r=o.n(n),l=(o(197),{components:{Loading:r.a},data:function(){return{sharing:{url:"https://m.jiffyfavors.com/",title:"Jiffy Favors",description:"Jiffy Favors- Food Delivery, Virtual Shopping & Bills Payment",hashtags:"jiffyfavors,bills,paybills,onlineorder"},networks:[{network:"facebook",name:"Facebook",icon:"mdi-facebook",color:"#1877f2"},{network:"email",name:"Email",icon:"mdi-gmail",color:"red"},{network:"skype",name:"Skype",icon:"mdi-skype-business",color:"#00aff0"},{network:"sms",name:"SMS",icon:"mdi-android-messages",color:"#333333"},{network:"telegram",name:"Telegram",icon:"mdi-telegram",color:"#0088cc"},{network:"twitter",name:"Twitter",icon:"mdi-twitter",color:"#1da1f2"},{network:"whatsapp",name:"Whatsapp",icon:"mdi-whatsapp",color:"#25d366"}],drawer:!1,isLoading:!1,items:[{action:"mdi-comment-alert-outline",title:"Reviews",active:!1,items:[{title:"Review Us",icon:"mdi-comment-check",link:""},{title:"Review Rider",icon:"mdi-motorbike",link:""},{title:"Review Merchant",icon:"mdi-store",link:""}]}]}},watch:{fcmToken:function(){return this.$store.getters["auth/getFCMToken"]}},methods:{displayNotification:function(t){"granted"==Notification.permission&&navigator.serviceWorker.getRegistration().then((function(e){var o={body:t.notification.body,icon:"/icon-96px.png",badge:"/icon-96px.png",vibrate:[100,50,100],data:t.notification.data};e.showNotification(t.notification.title,o)}))}},mounted:function(){var t=this;this.$fireMess.onMessage((function(e){t.displayNotification(e)}),(function(t){console.log("FCM Error:",t)}),(function(t){console.log("FCM Sucess",t)})),this.fcmToken||this.$fireMess.getToken().then((function(e){e&&t.$store.commit("auth/setFCMToken",e)})).catch((function(t){console.log("No Instance ID token available. Request permission to generate one.")}))},computed:{cartSize:function(){return this.$store.getters["cart/getCartItemCount"]}}}),c=o(17),v=o(45),d=o.n(v),m=o(467),f=o(475),h=o(412),_=o(439),k=o(206),w=o(386),y=o(297),V=o(469),C=o(470),S=o(398),x=o(294),L=o(200),F=o(295),I=o(391),T=o(359),M=o(389),N=o(296),j=o(360),z=o(476),B=o(109),R=o(471),$=o(363),J=o(304),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-layout",[o("v-card",{staticClass:"cardhyt mb-10",attrs:{flat:"",width:"100%"}},[o("loading",{attrs:{active:t.isLoading,loader:"bars","is-full-page":!0,color:"#00aff0"},on:{"update:active":function(e){t.isLoading=e}}}),t._v(" "),o("v-navigation-drawer",{attrs:{clipped:"",temporary:"",app:"",color:"#00aff0",absolute:"",app:"",dark:""},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[o("v-list",{staticClass:"py-0",attrs:{dense:"",nav:""}},[o("v-list-item",{attrs:{"two-line":""}},[o("v-list-item-avatar",{staticClass:"mr-2",attrs:{rounded:"",size:"35"}},[o("img",{attrs:{src:"/icon.png"}})]),t._v(" "),o("v-list-item-content",[o("v-list-item-title",[t._v("Jiffy Favors")]),t._v(" "),o("v-list-item-subtitle",[t._v("Your request, our ride!")])],1)],1),t._v(" "),o("v-divider"),t._v(" "),o("v-list-item",{attrs:{to:"/transactions"}},[o("v-list-item-icon",[o("v-icon",[t._v("mdi-history")])],1),t._v(" "),o("v-list-item-content",[o("v-list-item-title",[t._v("Transactions")])],1)],1),t._v(" "),o("v-list-item",{attrs:{href:"https://m.me/jiffyfavors",target:"_blank"}},[o("v-list-item-icon",[o("v-icon",[t._v("mdi-facebook-messenger")])],1),t._v(" "),o("v-list-item-content",[o("v-list-item-title",[t._v("Chat with Us")]),t._v(" "),o("v-list-item-subtitle",[t._v("Questions? Let us help!")])],1)],1),t._v(" "),o("v-bottom-sheet",{attrs:{inset:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;e.attrs;return[o("v-list-item",t._g({},n),[o("v-list-item-icon",[o("v-icon",[t._v("mdi-share-variant")])],1),t._v(" "),o("v-list-item-content",[o("v-list-item-title",[t._v("Share us")])],1)],1)]}}])},[t._v(" "),o("v-list",{attrs:{nav:"",flat:"","single-line":"",dense:""}},[o("v-subheader",[t._v("Share us")]),t._v(" "),t._l(t.networks,(function(e){return o("ShareNetwork",{key:e.network,style:{backgroundColor:e.color},attrs:{network:e.network,url:t.sharing.url,title:t.sharing.title,description:t.sharing.description,hashtags:t.sharing.hashtags}},[o("v-list-item",[o("v-list-item-icon",[o("v-icon",{attrs:{small:"",color:e.color}},[t._v(" "+t._s(e.icon)+" ")])],1),t._v(" "),o("v-list-item-title",[t._v(t._s(e.name))])],1)],1)}))],2)],1)],1)],1),t._v(" "),o("v-app-bar",{attrs:{dense:"",color:"#00aff0",app:"",dark:"",flat:""}},[o("v-app-bar-nav-icon",{on:{click:function(e){e.stopPropagation(),t.drawer=!t.drawer}}}),t._v(" "),o("v-toolbar-title",[t._v("Jiffy Favors ")]),t._v(" "),o("v-spacer"),t._v(" "),o("client-only",[t.cartSize>0?o("v-btn",{attrs:{icon:"",to:"/cart"}},[o("v-badge",{attrs:{color:"red"},scopedSlots:t._u([{key:"badge",fn:function(){return[t._v(" "+t._s(t.cartSize)+" ")]},proxy:!0}],null,!1,1285045876)},[t._v(" "),o("v-icon",{attrs:{color:"white",dense:""}},[t._v(" mdi-cart-outline ")])],1)],1):t._e()],1)],1),t._v(" "),o("v-sheet",{staticClass:"overflow-y-auto fill-height",attrs:{id:"scrolling-techniques-3"}},[o("v-container",{attrs:{fluid:""}},[o("v-content",[o("v-layout",{attrs:{wrap:"","justify-center":"","align-center":"","text-left":""}},[o("v-flex",{staticClass:"text-left pa-1",attrs:{xs6:"",md4:"",sm4:"",lg3:""}},[o("v-card",{attrs:{color:"red",dark:"",to:"/food"}},[o("v-card-title",[o("v-icon",{attrs:{size:"30"}},[t._v("mdi-food-fork-drink")]),t._v("Food")],1),t._v(" "),o("v-card-subtitle",[t._v("Order your food online and have it delivered to you")])],1)],1),t._v(" "),o("v-flex",{staticClass:"text-left pa-1",attrs:{xs6:"",md4:"",sm4:"",lg3:""}},[o("v-card",{attrs:{color:"green",dark:"",to:"/bills_payment"}},[o("v-card-title",[o("v-icon",{attrs:{size:"30"}},[t._v("mdi-account-cash")]),t._v("Pay Bills")],1),t._v(" "),o("v-card-subtitle",[t._v("Pay your bills without going out and waiting in line")])],1)],1)],1),t._v(" "),o("v-layout",{attrs:{wrap:"","justify-center":"","align-center":"","text-left":""}},[o("v-flex",{staticClass:"text-left pa-1",attrs:{xs12:"",md6:"",sm6:"",lg6:""}},[o("v-card",{attrs:{color:"blue",dark:"",to:"/shopping"}},[o("v-card-title",[o("v-icon",{attrs:{size:"30"}},[t._v("mdi-cart-arrow-right")]),t._v("Groceries, Market & Meds")],1),t._v(" "),o("v-card-subtitle",[t._v("Shop household supplies, medicine,local market (meat,fish & veggies) without going out")])],1)],1)],1)],1)],1)],1)],1)],1)}),[],!1,null,null,null),D=component.exports;d()(component,{VAppBar:m.a,VAppBarNavIcon:f.a,VBadge:h.a,VBottomSheet:_.a,VBtn:k.a,VCard:w.a,VCardSubtitle:y.b,VCardTitle:y.d,VContainer:V.a,VContent:C.a,VDivider:S.a,VFlex:x.a,VIcon:L.a,VLayout:F.a,VList:I.a,VListItem:T.a,VListItemAvatar:M.a,VListItemContent:N.b,VListItemIcon:j.a,VListItemSubtitle:N.c,VListItemTitle:N.d,VNavigationDrawer:z.a,VSheet:B.a,VSpacer:R.a,VSubheader:$.a,VToolbarTitle:J.a});var E={components:{Home:D},layout:"menu"},P=Object(c.a)(E,(function(){var t=this.$createElement;return(this._self._c||t)("home")}),[],!1,null,null,null);e.default=P.exports}}]);