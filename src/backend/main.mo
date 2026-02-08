import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Nat32 "mo:core/Nat32";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextProductId = 1 : Nat32;
  var nextOrderId = 1 : Nat32;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let productStore = Map.empty<Nat32, Product.Product>();
  let orderStore = Map.empty<Nat32, OrderModule.Order>();
  let cartStore = Map.empty<Principal, Cart.Cart>();
  let sellerProfiles = Map.empty<Principal, SellerProfile>();
  let buyerProfiles = Map.empty<Principal, BuyerProfile>();
  let deliveryPartnerProfiles = Map.empty<Principal, DeliveryPartnerProfile>();
  let companyAccountPersistentStore = Map.empty<Text, BankDetails>();

  public type Category = {
    id : Text;
    name : Text;
    description : Text;
  };

  let SUSTAINABLE_LIVING_CATEGORIES = [
    {
      id = "food-nutrition";
      name = "Food & Nutrition";
      description = "Nutritious, locally sourced food products";
    },
    {
      id = "clothing-textiles";
      name = "Clothing & Textiles";
      description = "Sustainable clothing, fabrics and materials";
    },
    {
      id = "shelter-home-needs";
      name = "Shelter & Home Needs";
      description = "Building materials, home essentials for rural areas";
    },
    {
      id = "water-sanitation";
      name = "Water & Sanitation";
      description = "Clean water and sanitation solutions";
    },
    {
      id = "energy-solutions";
      name = "Energy Solutions";
      description = "Renewable energy products and services";
    },
    {
      id = "rural-livelihood-products";
      name = "Rural & Livelihood Products";
      description = "Products supporting rural entrepreneurship";
    },
    {
      id = "health-personal-care";
      name = "Health & Personal Care";
      description = "Healthy and eco-friendly personal care products";
    },
    {
      id = "daily-essentials";
      name = "Daily Essentials";
      description = "Everyday household essentials";
    },
    {
      id = "education-skill-tools";
      name = "Education & Skill Tools";
      description = "Learning materials and skill development tools";
    },
    {
      id = "animal-nature-care";
      name = "Animal & Nature Care";
      description = "Products supporting animal welfare and nature care";
    },
  ];

  public type UserType = {
    #buyer;
    #seller;
    #deliveryPartner;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
    shippingAddress : ?Text;
    userType : UserType;
  };

  public type SellerProfile = {
    businessName : Text;
    gstNumber : ?Text;
  };

  public type BuyerProfile = {
    shippingAddress : Text;
    paymentMethod : ?Text;
    billingAddress : ?Text;
  };

  public type DeliveryPartnerProfile = {
    name : Text;
    contactDetails : Text;
    canServeOtherEcommerce : Bool;
    servicePricePaise : Nat;
  };

  module Product {
    public type Product = {
      id : Nat32;
      name : Text;
      description : Text;
      price : Nat;
      inventoryCount : Nat;
      categoryId : ?Text;
      fulfillmentType : Text;
      sellerId : ?Text;
      taxRate : ?Nat;
      shippingCharge : ?Nat;
      sku : ?Text;
    };
  };

  module Cart {
    public type CartItem = {
      product : Product.Product;
      quantity : Nat;
    };

    public type Cart = { items : List.List<CartItem> };

    public func new() : Cart {
      { items = List.empty<CartItem>() };
    };
  };

  module OrderModule {
    public type OrderStatus = {
      #Pending;
      #Confirmed;
      #Shipped;
      #Delivered;
      #Cancelled;
    };

    public type Order = {
      id : Nat32;
      userId : Principal;
      products : [Product.Product];
      quantities : [Nat];
      totalPrice : Nat;
      status : OrderStatus;
      createdAt : Int;
      ondcOrderId : ?Text;
      fulfillmentStatus : ?Text;
      paymentStatus : ?Text;
      itemPriceBreakdown : ?Nat;
      taxAmount : ?Nat;
      deliveryCharge : ?Nat;
      shippingAddress : ?Text;
    };
  };

  public type BankDetails = {
    bankName : Text;
    accountNumber : Text;
    ifsc : Text;
    accountHolderName : Text;
  };

  public query ({}) func listCategories() : async [Category] {
    SUSTAINABLE_LIVING_CATEGORIES;
  };

  public query ({}) func getCategory(categoryId : Text) : async ?Category {
    SUSTAINABLE_LIVING_CATEGORIES.find(func(cat) { cat.id == categoryId });
  };

  public query ({}) func listProducts() : async [Product.Product] {
    productStore.values().toArray();
  };

  public query ({}) func getProduct(productId : Nat32) : async ?Product.Product {
    productStore.get(productId);
  };

  public query ({}) func listProductsByCategory(categoryId : Text) : async [Product.Product] {
    let allProducts = productStore.values().toArray();
    allProducts.filter(func(p) { p.categoryId == ?categoryId });
  };

  public query ({}) func listProductIdsByCategory(categoryId : Text) : async [Nat32] {
    let allProducts = productStore.values().toArray();
    let filteredProducts = allProducts.filter(func(p) { p.categoryId == ?categoryId });
    filteredProducts.map(func(p) { p.id });
  };
};
