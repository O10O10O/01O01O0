const Store={key:'steak_v1',d:null,
def(){return{user:'',balance:10,pw:0,pl:0,g:{}}},
load(){try{this.d=JSON.parse(localStorage.getItem(this.key))}catch(e){}if(!this.d)this.d=this.def();return this.d},
save(){try{localStorage.setItem(this.key,JSON.stringify(this.d))}catch(e){}},
reset(){const u=this.d.user;this.d=this.def();this.d.user=u;this.save()}};
Store.load();
