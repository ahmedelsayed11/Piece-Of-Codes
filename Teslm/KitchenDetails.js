import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Animated,
  TextInput,
  AsyncStorage,
  LayoutAnimation,
  UIManager,
  Platform,
  RefreshControl,
  Modal,
} from 'react-native';
import {Container, Icon, Badge, Spinner} from 'native-base';
// import Icon2 from 'react-native-vector-icons/FontAwesome5'
import AwesomeAlert from 'react-native-awesome-alerts';
import NetInfo from '@react-native-community/netinfo';
import RadioGroup from 'react-native-radio-buttons-group';
import numbro from 'numbro';
// import Modal from 'react-native-modalbox';
import moment from 'moment';
import {Rating, AirbnbRating} from 'react-native-ratings';
import ModalCart from 'react-native-modalbox';
import axios from 'axios';
// import * as Animatable from 'react-native-animatable'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconVector from 'react-native-vector-icons/FontAwesome5';

const {height, width} = Dimensions.get('window');
import * as domainData from './domain';
var domain = domainData.domain;
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 55;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class KitchenDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successAlrt: false,
      scrollY: new Animated.Value(0),
      kitchen_id: JSON.parse(this.props.navigation.getParam('kitchenData'))
        .kitchen_id,
      Kitchen_name: JSON.parse(this.props.navigation.getParam('kitchenData'))
        .name,
      Kitchen_open: JSON.parse(this.props.navigation.getParam('kitchenData'))
        .open,
      Kitchen_image: {
        uri: JSON.parse(this.props.navigation.getParam('kitchenData')).image,
      },

      kitchen_data: [],
      Delivery: 0,
      Total: 0,
      shoppingCartItems: [],
      loading_kitchens: 'loading',
      user_id: 0,
      user_name: '',
      refresh: false,

      reviews: [],
      reviews_part: [],
      isLoading: false,
      rate_no: 0,
      review_text: '',
      rating: JSON.parse(this.props.navigation.getParam('kitchenData')).rating,
      connection_Status: '',
      UserStatus: '',
      model_loding: false,
      length_card: 0,
      allOption: false,
      kitchen_reviews: [],
      Less_Reviews: [],
      model_reviews: false,
      model_erorrs: false,
      worning_text: '',
      openitem: -1,
    };
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    console.disableYellowBox = true;
    NetInfo.addEventListener(state => {
      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });
        this.get_user_data();
        this.getKitchenData();
        this.getCart();
      } else {
        this.setState({
          connection_Status: 'Offline',
          isLoading: false,
        });
      }
    });
  }
  async go_login() {
    await AsyncStorage.setItem('checkout', 'go_CheckOut');
    this.props.navigation.navigate('Authentications');
  }
  get_user_data = async () => {
    let user_data = await AsyncStorage.getItem('userData');

    if (user_data) {
      user_data = JSON.parse(user_data);
    } else {
      user_data = {};
    }

    this.setState({user_id: user_data.user_id, user_name: user_data.name});
  };

  getCart = async () => {
    let FoodCart = await AsyncStorage.getItem('food_cart_store');
    const UserStatus = await AsyncStorage.getItem('UserStatus');

    //  alert(FoodCart.length)
    if (FoodCart) {
      FoodCart = JSON.parse(FoodCart);
    } else {
      FoodCart = [];
    }

    this.setState({shoppingCartItems: FoodCart, UserStatus: UserStatus});

    this.calculateTotal(FoodCart);
  };

  async setCart(passedCart) {
    await AsyncStorage.setItem('food_cart_store', JSON.stringify(passedCart));
  }

  refreshgetKitchenData() {
    this.setState({refresh: true});

    let data_to_send = {
      kitchen_id: this.state.kitchen_id,
    };

    axios.post(domain + `select_kitchen_data.php`, data_to_send).then(res => {
      // console.log(JSON.stringify(res.data))
      this.setState({refresh: false});
      if (res.status == 200) {
        if (res.data != 'error') {
          if (res.data.length > 0) {
            console.log(res.data); // print data to console

            res.data.map(item => {
              item.showList = false;
            });

            // console.log(JSON.stringify(res.data)); // print data to console
            this.setState({
              kitchen_data: res.data,
            });
          } else {
          }
        } else {
        }
      } else {
      }
    });
  }

  getKitchenData() {
    let data_to_send = {
      kitchen_id: this.state.kitchen_id,
    };

    axios.post(domain + `select_kitchen_data.php`, data_to_send).then(res => {
      //  console.log(JSON.stringify(res.data))
      if (res.status == 200) {
        if (res.data != 'error') {
          if (res.data.kitcen_data.length > 0) {
            res.data.kitcen_data.map(item => {
              item.showList = false;

              item.food_items.map(food_item => {
                food_item.showAllOption = false;
                if (food_item.options != undefined) {
                  let twoOptionArray = [];

                  food_item.options.map((option, index) => {
                    if (index == 0 || index == 1) {
                      twoOptionArray.push(option);
                    }
                  });

                  food_item.twoArrayOptions = twoOptionArray;
                }
              });
            });

            let Less_Reviews = [];
            for (let count = 0; count < 3; count++) {
              if (res.data.kitchen_reviews[count] == null) {
                continue;
              }
              Less_Reviews.push(res.data.kitchen_reviews[count]);
            }

            this.setState({
              kitchen_data: res.data.kitcen_data,
              loading_kitchens: 'have_data',
              kitchen_reviews: res.data.kitchen_reviews,
              Less_Reviews: Less_Reviews,
            });
            // console.log(res.data[0].kitchen_reviews)
          } else {
            this.setState({loading_kitchens: 'no_data'});
          }
        } else {
          this.setState({loading_kitchens: 'no_data'});

          // Alert.alert('Teslm', 'هناك شئ غير صحيح');
          this.setState({
            worning_text: 'هناك شىء غير صحيح',
            model_erorrs: true,
          });
        }
      } else {
        this.setState({loading_kitchens: 'no_data'});

        // Alert.alert('Teslm', 'هناك شئ غير صحيح');
        this.setState({worning_text: 'هناك شىء غير صحيح', model_erorrs: true});
      }
    });
  }

  calculateItemPrice(options) {
    let price = 0;
    for (let x = 0; x < options.length; x++) {
      if (options[x].selected) {
        price += parseFloat(options[x].price);
      }
    }

    return price;
  }

  updateRadioButtonsOptions(options, food_item_index, category_index) {
    let kitchenData = this.state.kitchen_data;

    kitchenData[category_index].food_items[food_item_index].options = options;

    let price_to_add = this.calculateItemPrice(options);
    kitchenData[category_index].food_items[food_item_index].originalPrice =
      kitchenData[category_index].food_items[food_item_index].purePrice +
      price_to_add;

    kitchenData[category_index].food_items[food_item_index].priceForRender =
      kitchenData[category_index].food_items[food_item_index].quantity *
      kitchenData[category_index].food_items[food_item_index].originalPrice;

    this.setState({kitchen_data: kitchenData});

    console.log(
      JSON.stringify(
        kitchenData[category_index].food_items[food_item_index].options,
      ),
    );

    // let
  }

  addToCart(food_item_index, category_index) {
    // let dishOfDay = this.state.DishAndKitchensData.dishOfDay

    let kitchenData = this.state.kitchen_data;

    let food_item = kitchenData[category_index].food_items[food_item_index];

    let newCartItem = {
      // item_id: this.state.shoppingCartItems.length,
      food_item_id: food_item.food_item_id,
      kitchen_name: food_item.kitchen_name,
      kitchen_id: food_item.kitchen_id,
      required_time: food_item.required_time,
      available_count: food_item.available_count,
      item_img: {uri: food_item.image_url},
      item_name: food_item.name,
      item_price_original: food_item.originalPrice,
      item_price_quantity: food_item.priceForRender,
      quantity: food_item.quantity,

      special_request: '',

      food_item_props:
        food_item.food_item_props.length > 0
          ? [
              {
                property_title: food_item.food_item_props[0].property_title,
                choice: '',
              },
            ]
          : [],
    };

    if (food_item.options) {
      for (let i = 0; i < food_item.options.length; i++) {
        if (food_item.options[i].selected == true) {
          newCartItem.food_item_props[0].choice = food_item.options[i].label;
        }
      }
    }

    for (let i = 1; i < food_item.food_item_props.length; i++) {
      newCartItem.food_item_props.push({
        property_title: food_item.food_item_props[i].property_title,
        choice: food_item.food_item_props[i].choices[0].label,
      });
    }

    let shoppingCart = this.state.shoppingCartItems;

    let found = false;

    for (
      var found_index = 0;
      found_index < shoppingCart.length;
      found_index++
    ) {
      if (
        newCartItem.food_item_id == shoppingCart[found_index].food_item_id &&
        JSON.stringify(newCartItem.food_item_props) ==
          JSON.stringify(shoppingCart[found_index].food_item_props)
      ) {
        newCartItem.quantity += shoppingCart[found_index].quantity;
        newCartItem.item_price_quantity =
          newCartItem.item_price_original * newCartItem.quantity;

        found = true;
        break;
      }
    }

    shoppingCart.splice(found_index, 1, newCartItem);

    // if(found==false){
    //   shoppingCart.push(newCartItem);
    // }

    this.setState({shoppingCardItems: shoppingCart});

    this.calculateTotal(shoppingCart);

    this.setState({successAlrt: true});

    this.setCart(shoppingCart);

    let length_card = shoppingCart.length;
    this.setState({length_card: length_card});
  }

  calculateTotal(passShoppingCart) {
    let shoppingCardItems = [];
    if (passShoppingCart) {
      shoppingCardItems = passShoppingCart;
    } else {
      shoppingCardItems = this.state.shoppingCartItems;
    }

    // let shoppingCardItems = this.state.shoppingCartItems
    let Total = 0;
    for (let i = 0; i < shoppingCardItems.length; i++) {
      Total += parseFloat(shoppingCardItems[i].item_price_quantity);
    }
    // alert(Total)

    this.setState({
      Total,
    });
  }

  openOption(index, indexOfItem) {
    let arr = this.state.kitchen_data[index].food_items;
    if (arr[indexOfItem].showAllOption == true) {
      arr[indexOfItem].showAllOption = false;
      this.setState({kitchenData: arr});
    } else {
      for (let i = 0; i < arr.length; i++) {
        arr[i].showAllOption = false;
      }

      arr[indexOfItem].showAllOption = true;
      this.setState({kitchenData: arr});
    }
  }

  quantityButton = (IndexOfKitchenItem, itemIndex, type) => {
    let kitchen_data = this.state.kitchen_data;
    let category = kitchen_data[IndexOfKitchenItem];
    let itemData = category.food_items[itemIndex];
    let quantity = parseInt(itemData.quantity);

    if (type == 'add') {
      // alert(quantity)
      quantity++;
      let quantityPrice =
        parseFloat(itemData.originalPrice) * parseInt(quantity);
      itemData.quantity = quantity;
      itemData.priceForRender = quantityPrice;
    } else {
      if (itemData.quantity == 1) {
      } else {
        quantity--;
        // alert(quantity)
        let quantityPrice =
          parseFloat(itemData.originalPrice) * parseInt(quantity);
        itemData.quantity = quantity;
        itemData.priceForRender = quantityPrice;
      }
    }

    kitchen_data[IndexOfKitchenItem].food_items[itemIndex] = itemData;
    this.setState({
      kitchen_data,
    });
  };

  updateShowList(index) {
    let kitchenDatax = this.state.kitchen_data;

    kitchenDatax[index].showList = !kitchenDatax[index].showList;

    alert(kitchenDatax);
    this.setState({
      kitchen_data: KitchenDatax,
    });
  }

  _renderAllItemsWithCategories = ({item, index}) => (
    <View key={index} style={{width: '90%', margin: '5%'}}>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
          let kitchensData = this.state.kitchen_data;
          kitchensData[index].showList = !kitchensData[index].showList;
          this.setState({
            kitchen_data: kitchensData,
          });
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            flex: 3,
          }}>
          <View style={{width: '90%'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}} numberOfLines={2}>
              {item.category_name}
            </Text>
          </View>
          <View style={{flex: 1}}>
            {item.showList == true ? (
              <IconVector
                size={25}
                name="chevron-circle-down"
                style={{alignSelf: 'flex-end'}}
              />
            ) : (
              <IconVector
                size={25}
                name="chevron-circle-left"
                style={{alignSelf: 'flex-end'}}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {item.showList == true ? (
        <View>
          {item.food_items.map((innerItem, indexOfItem) => {
            // alert(JSON.stringify(innerItem));
            return (
              <>
                <View
                  style={styles.itemsContentStyles}
                  key={innerItem.food_item_id}>
                  <TouchableOpacity
                    style={{width: '40%'}}
                    onPress={() => {
                      this.props.navigation.navigate('FoodItemDetailsPage', {
                        food_item_data: JSON.stringify(innerItem),
                      });
                    }}>
                    <View style={{flex: 1}}>
                      <Image
                        source={{uri: innerItem.image_url}}
                        style={{
                          flex: 1,
                          width: null,
                          height: null,
                          paddingBottom: 15,
                          borderTopLeftRadius: 20,
                          borderBottomLeftRadius: 20,
                        }}
                      />

                      {innerItem.badge != 'none' ? (
                        <Badge
                          style={{
                            position: 'absolute',
                            left: 5,
                            top: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#EB3762',
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 13,
                            }}>
                            {innerItem.badge == 'discount'
                              ? '-' + innerItem.discount + '%'
                              : innerItem.badge == 'new'
                              ? 'new'
                              : null}
                          </Text>
                        </Badge>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      // backgroundColor: '#ff0',
                      paddingLeft: 10,
                      width: '60%',
                    }}>
                    <View
                      style={{
                        // marginLeft: 10,
                        width: '80%',
                        justifyContent: 'center',
                        // alignItems: 'center',
                        paddingBottom: 15,
                        // backgroundColor:"red"
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          // width:'90%',
                          // fontWeight: '600',
                          fontSize: 14,
                          color: '#969696',
                          marginTop: 5,
                          paddingLeft: 0,
                          fontFamily: 'Janna LT Bold',
                          // backgroundColor: '#00f'
                        }}>
                        {innerItem.ingredient.join(' - ')}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{fontFamily: 'Janna LT Bold', fontSize: 16}}>
                        {innerItem.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingBottom: 10,
                        // backgroundColor: '#ff0',
                        // marginTop: -10,
                        // alignItems: 'center',
                        // justifyContent: 'space-between',
                      }}>
                      {/* <View
                        style={{
                          // marginTop: 20,
                          alignItems: 'flex-end',
                          justifyContent: 'flex-end',
                          
                          overflow: 'hidden',
                          // marginLeft: -15,
                          // backgroundColor: 'red',
                        }}> */}
                      {/* {innerItem.options ? (
                          <>
                            <>
                              {innerItem.showAllOption == false ? (
                                <RadioGroup
                                  style={{justifyContent: 'felx-start'}}
                                  radioButtons={innerItem.twoArrayOptions}
                                  onPress={options => {
                                    this.updateRadioButtonsOptions(
                                      options,
                                      item.food_items.indexOf(innerItem),
                                      index,
                                    );
                                  }}
                                />
                              ) : null}
                            </>

                            {innerItem.showAllOption == true ? (
                              <RadioGroup
                                style={{justifyContent: 'felx-start'}}
                                radioButtons={innerItem.options}
                                onPress={options => {
                                  this.updateRadioButtonsOptions(
                                    options,
                                    item.food_items.indexOf(innerItem),
                                    index,
                                  );
                                }}
                              />
                            ) : (
                              <TouchableOpacity
                                style={{marginBottom: 8}}
                                onPress={() => {
                                  this.props.navigation.navigate(
                                    'FoodItemDetailsPage',
                                    {
                                      food_item_data: JSON.stringify(innerItem),
                                    },
                                  );
                                }}>
                                <Text
                                  style={{
                                    color: '#2fcc70',
                                    borderBottomColor: '#0f0',
                                    borderBottomWidth: 1,
                                  }}>
                                  عرض المزيد
                                </Text>
                              </TouchableOpacity>
                            )}
                          </>
                        ) : null} */}
                      {/* </View> */}
                      <View
                        style={{
                          width: '100%',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          // backgroundColor:"#f0f"
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // backgroundColor: 'red',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              let indexOfItemData = item.food_items.indexOf(
                                innerItem,
                              );
                              // alert(JSON.stringify(item ))
                              // alert(x)
                              let indexofKitchenData = this.state.kitchen_data.indexOf(
                                item,
                              );
                              // alert(indexofKitchenData)
                              this.quantityButton(
                                indexofKitchenData,
                                indexOfItemData,
                                'remove',
                              );
                            }}
                            style={{
                              // margin: 10,
                              width: 30,
                              height: 30,
                              borderRadius: 50,
                              borderWidth: 1,
                              borderColor: '#ddd',
                              // backgroundColor: '#ddd',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 5,
                            }}>
                            <IconVector
                              name="minus"
                              style={{textAlign: 'center'}}
                            />
                          </TouchableOpacity>

                          <Text
                            style={{
                              // fontWeight: '600',
                              fontSize: 18,
                              marginRight: 10,
                              marginLeft: 10,
                              fontFamily: 'Janna LT Bold',
                            }}>
                            {innerItem.quantity}
                          </Text>

                          <TouchableOpacity
                            onPress={() => {
                              let indexOfItemData = item.food_items.indexOf(
                                innerItem,
                              );
                              // alert(JSON.stringify(item ))
                              // alert(x)
                              let indexofKitchenData = this.state.kitchen_data.indexOf(
                                item,
                              );
                              this.quantityButton(
                                indexofKitchenData,
                                indexOfItemData,
                                'add',
                              );
                            }}
                            style={{
                              // margin: 10,
                              width: 30,
                              height: 30,
                              borderRadius: 50,
                              borderWidth: 1,
                              borderColor: '#ddd',
                              // backgroundColor: '#ddd',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 5,
                            }}>
                            <IconVector
                              name="plus"
                              style={{textAlign: 'center'}}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            // fontWeight: '600',
                            fontFamily: 'Janna LT Bold',
                            fontSize: 16,
                            // marginLeft: 15,
                            marginTop: 7,
                            textAlign: 'center',
                          }}>
                          {numbro(innerItem.priceForRender).format({
                            thousandSeparated: true,
                            mantissa: 2, // number of decimals displayed
                          })}{' '}
                          جنيه
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      this.addToCart(item.food_items.indexOf(innerItem), index);
                    }}
                    style={{
                      position: 'absolute',
                      right: -10,
                      top: -15,
                      backgroundColor: '#2fcc70',
                      // padding: 10,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 45,
                    }}>
                    <View>
                      <IconVector
                        size={20}
                        name="shopping-cart"
                        style={{color: 'white'}}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            );
          })}
        </View>
      ) : null}
    </View>
  );

  // update state
  // updateRadioButtonsOptions = options => {
  //   let kitchenData = this.state.kitchen_data
  //   DishAndKitchensData.dishOfDay.options = options
  //   // optionsx = options
  //   this.setState({
  //     DishAndKitchensData,
  //   })
  //   // this.setState({DishAndKitchensData})
  // }

  shoppingQuantityButton = (kind, index) => {
    let shoppingCartItems = this.state.shoppingCartItems;
    let Total = parseFloat(this.state.Total);

    if (kind == 'add') {
      if (
        shoppingCartItems[index].available_count >
        shoppingCartItems[index].quantity
      ) {
        shoppingCartItems[index].quantity =
          shoppingCartItems[index].quantity + 1;
        shoppingCartItems[index].item_price_quantity =
          shoppingCartItems[index].quantity *
          shoppingCartItems[index].item_price_original;
        Total += parseFloat(shoppingCartItems[index].item_price_original);
      } else {
        // Alert.alert(
        //   'Teslm',
        //   'العدد المتاح لهذا العنصر هو ' +
        //     shoppingCartItems[index].available_count,
        // );
        this.setState({
          worning_text:
            'العدد المتاح لهذا العنصر هو ' +
            shoppingCartItems[index].available_count,
          model_erorrs: true,
        });
      }
    } else {
      if (shoppingCartItems[index].quantity == 1) {
        // Alert.alert('Teslm', 'يجب أن تكون الكمية أكبر من واحد');
        this.setState({
          worning_text: 'يجب أن تكون الكمية أكبر من واحد',
          model_erorrs: true,
        });
      } else {
        Total -= parseFloat(shoppingCartItems[index].item_price_original);
        shoppingCartItems[index].quantity =
          shoppingCartItems[index].quantity - 1;
        shoppingCartItems[index].item_price_quantity =
          shoppingCartItems[index].quantity *
          shoppingCartItems[index].item_price_original;

        // alert(shoppingCartItems[index].item_price_quantity)
      }
    }

    this.setState({
      shoppingCartItems,
      Total,
    });
    this.setCart(shoppingCartItems);
    // this.calculateTotal()
  };

  removeShoppingItem = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    let shoppingCardItems = this.state.shoppingCartItems;
    // alert(shoppingCardItems[index].item_price_quantity)
    let Total =
      parseFloat(this.state.Total) -
      parseInt(shoppingCardItems[index].item_price_quantity);
    shoppingCardItems.splice(index, 1);

    this.setState({
      shoppingCardItems,
      Total,
    });
    // this.calculateTotal()
    this.setCart(shoppingCardItems);
  };

  get_reviews = () => {
    let data_to_send = {
      kitchen_id: this.state.kitchen_id,
    };

    axios
      .post(domain + `select_kitchen_reviews.php`, data_to_send)
      .then(res => {
        if (res.status == 200) {
          if (res.data != 'error') {
            this.setState({
              reviews: res.data,
              isLoading: false,
            });
            if (this.state.reviews.length > 5) {
              this.setState({reviews_part: this.state.reviews.slice(0, 5)});
            }
          } else {
            // Alert.alert('Teslm', 'خطأ');
            this.setState({worning_text: 'حدث خطأ ما', model_erorrs: true});

            this.setState({
              isLoading: false,
            });
          }
        } else {
          // Alert.alert('خطأ', 'هناك شئ غير صحيح');
          this.setState({worning_text: 'حدث خطأ ما', model_erorrs: true});

          this.setState({
            isLoading: false,
          });
        }
      });
  };

  upload_review = () => {
    if (this.state.rate_no == 0 && this.state.review_text == '') {
      // Alert.alert('Teslm', 'أدخل معدل أو نص ..');
      this.setState({
        worning_text: 'أدخل   تقييم او نص  ..',
        model_erorrs: true,
      });
    } else {
      let data_to_send = {
        user_id: this.state.user_id,
        user_name: this.state.user_name,
        kitchen_id: this.state.kitchen_id,
        rate_no: this.state.rate_no,
        review_text: this.state.review_text,
      };
      if (this.state.connection_Status == 'Online') {
        axios.post(domain + `add_review.php`, data_to_send).then(res => {
          // this.setState({disabled: false});
          if (res.status == 200) {
            // alert(res.data)
            if (res.data == 'success') {
              let list = this.state.reviews;
              let list2 = this.state.reviews_part;
              list.unshift({
                review_id: 0 + '',
                user_name: this.state.user_name,
                user_id: this.state.user_id + '',
                kitchen_id: this.state.kitchen_id + '',
                rate_no: this.state.rate_no + '',
                review_text: this.state.review_text,
                date: 'now',
              });
              list2.unshift({
                review_id: 0 + '',
                user_name: this.state.user_name,
                user_id: this.state.user_id + '',
                kitchen_id: this.state.kitchen_id + '',
                rate_no: this.state.rate_no + '',
                review_text: this.state.review_text,
                date: 'now',
              });
              list.pop();
              this.setState({
                reviews: list,
                reviews_part: list2,
                review_text: '',
                rate_no: 0,
              });
              // Alert.alert('Teslm', 'اضيف بنجاح..');
              this.setState({
                worning_text: 'تمت الاضافه بنجاح',
                model_erorrs: true,
              });
            } else {
              // Alert.alert('Teslm', 'خطأ');
              this.setState({
                worning_text: 'حدث خطأ ما من فضلك حاول في وقتاَ لاحق',
                model_erorrs: true,
              });
            }
          } else {
            // Alert.alert('خطأ', 'هناك شئ غير صحيح');
            this.setState({
              worning_text: 'حدث خطأ ما من فضلك حاول في وقتاَ لاحق',
              model_erorrs: true,
            });
          }
        });
      } else {
        this.setState({loading: false});
        // Alert.alert('تحقق من اتصالك بالإنترنت من فضلك');
        this.setState({
          worning_text: 'تحقق من الاتصال بالانترنت',
          model_erorrs: true,
        });
      }
    }
  };

  formatDate = date => {
    if (date == 'now') {
      return date;
    }
    let momentObj = moment(date, 'YYYY-MM-DD');
    let showDate = moment(momentObj).format('MMM DD, YYYY');
    return showDate;
  };

  getDate(alldate) {
    var date = alldate.slice(0, 11);
    // alert((date))

    return date;
  }

  ratingCompleted = rating => {
    this.setState({rate_no: rating});
  };

  _renderReview = ({item}) => {
    return (
      <View
        style={{
          width: '90%',
          marginHorizontal: '5%',
          marginBottom: 10,
          flexWrap: 'wrap',
          // height: 150,
          backgroundColor: '#fff',
          flexDirection: 'row',
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 1,
          paddingVertical: 10,
          // overflow: 'hidden',
        }}>
        <View style={{marginLeft: 20, width: '100%'}}>
          <View style={styles.oreder_product}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 15,
                fontFamily: 'Metropolis',
              }}>
              {item.user_name}
            </Text>
            <Text
              style={{
                fontWeight: '300',
                fontSize: 15,
                fontFamily: 'Metropolis',
                color: '#999',
              }}>
              {this.formatDate(item.date.slice(0, 10))}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
            }}>
            <Rating
              readonly={true}
              type="star"
              // ratingImage={WATER_IMAGE}
              ratingColor="#3498db"
              ratingBackgroundColor="#fff"
              ratingCount={5}
              imageSize={15}
              startingValue={parseInt(item.rate_no)}
              // onFinishRating={this.ratingCompleted}
              style={{paddingVertical: 10}}
            />
          </View>
          <Text
            style={{
              fontWeight: '400',
              fontSize: 15,
              color: '#888',
              fontFamily: 'Metropolis',
              marginTop: 10,
              width: '85%',
              // textAlign: 'justify',
            }}>
            {item.review_text}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });

    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, 10],
      extrapolate: 'clamp',
    });

    const backgroundColorChange = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: ['transparent', 'transparent', '#2fcc70'],
      extrapolate: 'clamp',
    });

    const changeBackButtonOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 1, 1],
      extrapolate: 'clamp',
    });

    return (
      <Container
        style={{
          backgroundColor:
            this.state.model_loding == false ? '#F9F9F9' : '#ddd',
          opacity: this.state.model_loding == false ? null : 0.2,
        }}>
        <StatusBar backgroundColor="#2fcc70" />
        {/* <StatusBar backgroundColor='#2fcc70' /> */}
        <ScrollView
          style={styles.fill}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
          ])}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={() => {
                this.refreshgetKitchenData();
                console.log('hi');
              }}
            />
          }>
          {this.state.connection_Status == 'Online' ? (
            this.state.loading_kitchens == 'loading' ? (
              <>
                <Image
                  source={require('./images/cooking_loader_0.gif')}
                  style={{
                    width: '100%',
                    height: 300,
                    marginTop: HEADER_MAX_HEIGHT + 20,
                  }}
                />
                <Text
                  style={{
                    color: '#2fcc70',
                    textAlign: 'center',
                    fontSize: 18,
                    marginTop: 10,
                    fontWeight: 'bold',
                  }}>
                  جاري تحميل القائمة...
                </Text>
              </>
            ) : this.state.loading_kitchens == 'have_data' ? (
              <>
                <FlatList
                  style={{marginTop: HEADER_MAX_HEIGHT}}
                  data={this.state.kitchen_data}
                  renderItem={(item, index) =>
                    this._renderAllItemsWithCategories(item, index)
                  }
                  extraData={this.state.kitchen_data}
                  keyExtractor={item => item.category_id}
                />
              </>
            ) : (
              <>
                <Image
                  source={require('./images/not_found.png')}
                  style={{
                    height: 300,
                    width: 200,
                    alignSelf: 'center',

                    marginTop: HEADER_MAX_HEIGHT + 20,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    color: '#2fcc70',
                    textAlign: 'center',
                    fontSize: 18,
                    marginTop: 10,
                    marginBottom: 10,
                    fontWeight: 'bold',
                  }}>
                  القائمة غير متوفرة ... 😕
                </Text>
              </>
            )
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: height / 4,
              }}>
              <Image
                source={require('./images/not_found.png')}
                style={{
                  width: '100%',
                  height: 250,
                  resizeMode: 'contain',
                  marginTop: 50,
                }}
              />
              <Text style={{fontSize: 18}}> لا يوجد اتصال</Text>
            </View>
          )}

          <View
            style={[
              styles.oreder_product,
              {marginTop: 25, width: '90%', marginHorizontal: '5%'},
            ]}>
            <Text style={styles.header_text_style}>المعدل & الاراء</Text>

            <View
              style={{
                justifyContent: 'flex-end',
                // alignItems: 'flex-end',
                flexDirection: 'row',
                width: '50%',
                paddingTop: 3,
              }}>
              <Rating
                readonly={true}
                type="star"
                // ratingImage={WATER_IMAGE}
                ratingColor="#3498db"
                ratingBackgroundColor="#f7f7f7"
                ratingCount={5}
                imageSize={15}
                startingValue={this.state.rating.rating_score}
                // onFinishRating={this.ratingCompleted}
                style={{marginTop: 5}}
              />
              <Text style={{fontWeight: '800'}}>
                {' '}
                ({this.state.rating.no_of_rating})
              </Text>
            </View>
          </View>

          {this.state.Less_Reviews.map(item => (
            <>
              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  alignSelf: 'flex-start',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    alignSelf: 'flex-start',
                  }}>
                  {item.user_name}
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    marginLeft: 8,
                  }}>
                  <Rating
                    readonly={true}
                    type="star"
                    ratingColor="#3498db"
                    ratingBackgroundColor="#fff"
                    ratingCount={5}
                    imageSize={18}
                    startingValue={item.rate_no}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text>{this.getDate(item.date)}</Text>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  paddingRight: 15,
                  paddingLeft: 10,
                  fontSize: 14,
                  alignSelf: 'flex-start',
                  marginBottom: 10,
                }}>
                {item.review_text}
              </Text>
            </>
          ))}

          {this.state.kitchen_reviews.length > 3 ? (
            <TouchableOpacity
              onPress={() => {
                this.setState({model_reviews: true});
              }}
              style={{marginLeft: 20}}>
              <Text
                style={{fontSize: 17, fontWeight: 'bold', color: '#2fcc70'}}>
                عرض جميع التعليقات
              </Text>
            </TouchableOpacity>
          ) : null}

          {this.state.UserStatus == null ||
          this.state.UserStatus == 'intro_null' ? null : this.state
              .isLoading ? (
            <Spinner color={'#2fcc70'} />
          ) : this.state.reviews.length == 0 ? (
            <View>
              <View
                style={{
                  width: '90%',
                  margin: '5%',
                  flexWrap: 'wrap',
                  // height: 150,
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 1,
                  paddingVertical: 10,
                  // overflow: 'hidden',
                }}>
                <View style={{marginLeft: 20, width: '100%'}}>
                  <View style={styles.oreder_product}>
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 15,
                        fontFamily: 'Metropolis',
                      }}>
                      {this.state.user_name}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#2fcc70',
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                      }}
                      onPress={() => this.upload_review()}>
                      <Text
                        style={{
                          fontWeight: '300',
                          fontSize: 15,
                          fontFamily: 'Metropolis',
                          color: '#fff',
                        }}>
                        أضف
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      flexDirection: 'row',
                    }}>
                    <Rating
                      readonly={false}
                      type="star"
                      // ratingImage={WATER_IMAGE}
                      ratingColor="#3498db"
                      ratingBackgroundColor="#c8c7c8"
                      ratingCount={5}
                      imageSize={15}
                      startingValue={0}
                      onFinishRating={this.ratingCompleted}
                      style={{paddingVertical: 10}}
                    />
                  </View>
                  <TextInput
                    placeholder="اكتب رأيك هنا ..."
                    multiline
                    style={{
                      fontWeight: '400',
                      fontSize: 15,
                      color: '#888',
                      fontFamily: 'Metropolis',
                      marginTop: 10,
                      width: '75%',
                      minHeight: 40,
                      maxHeight: 100,
                      borderWidth: 1,
                      borderRadius: 5,
                      paddingLeft: 5,
                      borderColor: '#ddd',

                      // textAlign: 'justify',
                    }}
                    value={this.state.review_text}
                    onChangeText={value => {
                      this.setState({review_text: value});
                    }}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View
                style={{
                  width: '90%',
                  margin: '5%',
                  flexWrap: 'wrap',
                  // height: 150,
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 1,
                  paddingVertical: 10,
                  // overflow: 'hidden',
                }}>
                <View style={{marginLeft: 20, width: '100%'}}>
                  <View style={styles.oreder_product}>
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 15,
                        fontFamily: 'Metropolis',
                      }}>
                      {this.state.user_name}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#2fcc70',
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                      }}
                      onPress={() => this.upload_review()}>
                      <Text
                        style={{
                          fontWeight: '300',
                          fontSize: 15,
                          fontFamily: 'Metropolis',
                          color: '#fff',
                        }}>
                        أضف
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      flexDirection: 'row',
                    }}>
                    <Rating
                      readonly={false}
                      type="star"
                      // ratingImage={WATER_IMAGE}
                      ratingColor="#3498db"
                      ratingBackgroundColor="#c8c7c8"
                      ratingCount={5}
                      imageSize={15}
                      startingValue={0}
                      onFinishRating={this.ratingCompleted}
                      style={{paddingVertical: 10}}
                    />
                  </View>
                  <TextInput
                    placeholder="اكتب رايك هنا..."
                    multiline
                    style={{
                      fontWeight: '400',
                      fontSize: 15,
                      color: '#888',
                      fontFamily: 'Metropolis',
                      marginTop: 10,
                      width: '75%',
                      minHeight: 40,
                      maxHeight: 100,
                      borderWidth: 1,
                      borderRadius: 5,
                      paddingLeft: 5,
                      borderColor: '#ddd',

                      // textAlign: 'justify',
                    }}
                    value={this.state.review_text}
                    onChangeText={value => {
                      this.setState({review_text: value});
                    }}
                  />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <Animated.View
          style={[styles.header, {transform: [{translateY: headerTranslate}]}]}>
          <Animated.Image
            source={this.state.Kitchen_image}
            style={[
              styles.backgroundImage,
              {
                opacity: imageOpacity,
                transform: [{translateY: imageTranslate}],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.bar,
              {
                transform: [{translateY: titleTranslate}],
                backgroundColor: backgroundColorChange,
              },
            ]}>
            <Animated.View
              style={[
                {
                  width: '20%',
                  // backgroundColor: '#ff0',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                },
                {opacity: changeBackButtonOpacity},
              ]}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <IconVector
                  name="chevron-right"
                  size={25}
                  style={{
                    marginLeft: 8,
                    // marginTop: 10,
                    color: '#fff',
                  }}
                />
              </TouchableOpacity>
            </Animated.View>

            <View style={{width: '60%'}}>
              <Text
                style={{textAlign: 'center', fontFamily: 'Janna LT Bold'}}
                numberOfLines={1}
                style={styles.title}>
                {this.state.Kitchen_name}
              </Text>
            </View>

            <View style={{width: '20%'}}>
              {this.state.Kitchen_open == '0' ? (
                <Badge
                  style={{
                    // left: 5,
                    // top: 5,

                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f04',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 13,
                      paddingLeft: 10,
                      paddingRight: 10,
                      fontFamily: 'Janna LT Bold',
                    }}>
                    مغلق
                  </Text>
                </Badge>
              ) : null}
            </View>
          </Animated.View>
        </Animated.View>

        <ModalCart
          style={{
            height: height / 1.6,
            // maxHeight: height / 1.2,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: '#F9F9F9',
          }}
          backdropPressToClose={() => true}
          isOpen={this.state.openShoppingCartModal}
          //   isOpen={true}
          backdrop={true}
          onClosed={() => {
            this.setState({
              openShoppingCartModal: false,
            });
          }}
          swipeArea={50}
          position="bottom"
          useNativeDriver={false}>
          {/* <Text>Modal with backdrop content</Text> */}
          <View style={{flexDirection: 'row', width: '90%', margin: '5%'}}>
            {/* <Icon name="md-cart" style={{color: '#D8D8D8'}} />
             */}
            <Image
              source={require('./images/cart.png')}
              style={{height: 35, width: 35, resizeMode: 'stretch'}}
            />

            <Text
              style={{
                marginLeft: 30,
                fontWeight: '800',
                fontSize: 20,
                fontFamily: 'Janna LT Bold',
              }}>
              طلباتك
            </Text>
          </View>

          {this.state.shoppingCartItems.length > 0 ? (
            <ScrollView style={{paddingBottom: 150}}>
              {this.state.shoppingCartItems.map(item => {
                return (
                  <View
                    style={{
                      width: '90%',
                      margin: '5%',
                      flexDirection: 'row',
                      // borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 15,
                      backgroundColor: 'white',
                      // justifyContent:'space-between'
                      // overflow: 'hidden',
                    }}>
                    <View style={{width: '30%'}}>
                      <Image
                        source={item.item_img}
                        style={{
                          flex: 1,
                          width: null,
                          height: null,
                          //   borderTopRightRadius: 15,
                          borderBottomLeftRadius: 15,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: '38%',
                        height: '100%',
                        marginLeft: 10,
                        paddingBottom: 10,
                        paddingRight: 20,
                        // backgroundColor:'#f00'
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontWeight: '700',
                          marginBottom: 10,
                          marginTop: 10,
                          fontSize: 14,
                          // paddingRight:10
                        }}>
                        {item.item_name}
                      </Text>
                      <Text
                        style={{
                          fontWeight: '500',
                          color: '#474554',
                          marginBottom: 10,
                        }}>
                        {item.food_item_props.length > 0
                          ? item.food_item_props[0].choice
                          : null}
                      </Text>
                      <Text style={{fontWeight: '500', fontSize: 14}}>
                        {numbro(item.item_price_quantity).format({
                          thousandSeparated: true,
                          mantissa: 2, // number of decimals displayed
                        })}{' '}
                        جنيه
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        // bottom: 0,
                        width: '28%',
                        marginLeft: '-5%',
                        paddingTop: 15,
                        // right:0,
                        justifyContent: 'center',
                        // backgroundColor: "#ff0",
                        alignItems: 'center',
                        //   backgroundColor: 'red',
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.shoppingQuantityButton(
                            'minus',
                            this.state.shoppingCartItems.indexOf(item),
                          )
                        }
                        style={{
                          margin: 5,
                          width: 30,
                          height: 30,
                          borderRadius: 50,
                          borderWidth: 1,
                          borderColor: '#ddd',
                          // backgroundColor: '#ddd',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 5,
                        }}>
                        <IconVector
                          name="minus"
                          style={{textAlign: 'center'}}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          // marginTop: 10,
                          fontWeight: '700',
                          fontSize: 18,
                        }}>
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          this.shoppingQuantityButton(
                            'add',
                            this.state.shoppingCartItems.indexOf(item),
                          )
                        }
                        style={{
                          margin: 5,
                          width: 30,
                          height: 30,
                          borderRadius: 50,
                          borderWidth: 1,
                          borderColor: '#ddd',
                          // backgroundColor: '#ddd',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 5,
                        }}>
                        <IconVector name="plus" style={{textAlign: 'center'}} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.removeShoppingItem(
                          this.state.shoppingCartItems.indexOf(item),
                        );
                      }}
                      style={{
                        width: 30,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'red',
                        borderRadius: 50,
                        position: 'absolute',
                        top: -10,
                        left: -10,
                      }}>
                      <View>
                        <IconVector name="times" style={{color: 'white'}} />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: 'Janna LT Bold', fontSize: 15}}>
                عربة التسوق الخاصه بك فارغه , تابع التسوق
              </Text>
            </View>
          )}

          <View style={{height: 40}}>
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                margin: '5%',
                justifyContent: 'space-between',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                margin: '5%',
                justifyContent: 'space-between',
                marginTop: -15,
              }}>
              <Text style={{fontWeight: 'bold'}}>المجموع </Text>

              <Text style={{fontWeight: 'bold'}}>
                {/* {this.state.Total} EGP */}
                {/* {numbro(this.state.Total).format()} */}
                {numbro(this.state.Total).format({
                  thousandSeparated: true,
                  mantissa: 2, // number of decimals displayed
                })}{' '}
                جنيه
              </Text>
            </View>
          </View>

          <View style={{}}>
            <TouchableOpacity
              disabled={this.state.shoppingCartItems.length == 0}
              onPress={() => {
                this.setState({openShoppingCartModal: false});
                if (
                  this.state.UserStatus == null ||
                  this.state.UserStatus == 'intro_null'
                ) {
                  this.setState({model_loding: true});
                  // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                } else {
                  this.props.navigation.navigate('CheckOutPage');
                }
              }}
              style={{
                width: '90%',
                margin: '5%',
                alignItems: 'center',

                justifyContent: 'center',
                backgroundColor: '#2fcc70',
                padding: 10,
                borderRadius: 50,
              }}>
              <View>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontFamily: 'Janna LT Bold',
                  }}>
                  الدفع{' '}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ModalCart>

        <TouchableOpacity
          style={{
            // borderTopWidth:0.8,
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            backgroundColor: 'white',
          }}
          onPress={() => {
            // this._panel.show()
            this.getCart();
            this.setState({
              openShoppingCartModal: true,
            });
            // alert("00")
          }}>
          {/* <Text>Show Slide</Text> */}
          <View style={{width: 20, height: 2, backgroundColor: '#ccc'}} />
          {/* <Icon
            name="md-cart"
            style={{
              color: '#AFAFAF',
              // borderTopWidth: 1,
              // borderTopColor: '#2fcc70',
            }}
          /> */}
          <View style={{flexDirection: 'row'}}>
            {this.state.shoppingCartItems.length != 0 ? (
              <View
                style={{
                  backgroundColor: '#2fcc70',
                  height: 20,
                  width: 20,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <Text style={{textAlign: 'center'}}>
                  {this.state.shoppingCartItems.length}
                </Text>
              </View>
            ) : null}
            <Image
              source={require('./images/cart.png')}
              style={{height: 35, width: 35, resizeMode: 'stretch'}}
            />
          </View>
        </TouchableOpacity>

        <AwesomeAlert
          show={this.state.successAlrt}
          showProgress={false}
          // progressSize={50}
          title="نجاح"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={false}
          showConfirmButton={true}
          onDismiss={() => {
            this.setState({successAlrt: false});
          }}
          onConfirmPressed={() => {
            this.setState({successAlrt: false});
          }}
          confirmText="حسنا، شكرا"
          confirmButtonColor="#2fcc70"
          contentContainerStyle={{borderRadius: 5}}
          // overlayStyle={{ width: '120%', height: '120%' }}
          customView={
            <>
              <Text>تمت إضافة العنصر بنجاح</Text>
              <Image
                source={require('./images/cart.png')}
                style={{
                  width: 250,
                  height: 150,
                  borderRadius: 0,
                  marginTop: 20,
                  resizeMode: 'contain',
                }}
              />
            </>
          }
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.model_loding}
          onRequestClose={() => {
            this.setState({model_loding: false});
          }}>
          <View style={{flex: 1}}>
            <View
              style={{
                height: height,
                width: width,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: '80%',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  elevation: 5,
                  paddingVertical: 10,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: '#2fcc70',
                    fontWeight: 'bold',
                    fontSize: 22,
                    textAlign: 'center',
                  }}>
                  Teslm
                </Text>
                <Text style={{padding: 15, fontSize: 18}}>
                  برجاء تسجيل الدخول للدفع
                </Text>

                <TouchableOpacity
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    padding: 10,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    elevation: 3,
                    marginBottom: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    // this.props.navigation.navigate('Authentications');
                    this.go_login();
                  }}>
                  <MaterialCommunityIcons
                    name="arrow-right-bold-box"
                    size={30}
                    color={'#2fcc70'}
                  />
                  <Text
                    style={{fontWeight: 'bold', color: '#000', fontSize: 16}}>
                    التسجيل
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    padding: 10,
                    backgroundColor: '#f00',
                    borderRadius: 10,
                    elevation: 3,
                    marginBottom: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({model_loding: false});
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: 18,
                    }}>
                    إلغاء
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={this.state.model_reviews}
          onRequestClose={() => {
            this.setState({model_reviews: false});
          }}
          animationType="slide">
          <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
            <TouchableOpacity
              onPress={() => {
                this.setState({model_reviews: false});
                // this.props.navigation.goBack();
              }}
              style={{
                alignItems: 'flex-start',
                paddingLeft: '5%',
                marginTop: 5,
              }}>
              <MaterialCommunityIcons
                name="chevron-right"
                color={'#2fcc70'}
                size={35}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginRight: 15,
                marginVertical: 15,
              }}>
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: 'Metropolis',
                  fontWeight: 'bold',
                  marginLeft: 16,
                  color: '#2fcc70',
                }}>
                الأراء و التقييم
              </Text>
            </View>

            <ScrollView>
              {this.state.kitchen_reviews.map(item => (
                <>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      alignSelf: 'flex-start',
                      // backgroundColor: '#523',
                      width: '90%',
                      margin: '5%',
                      borderWidth: 1,
                      borderColor: '#ddd',
                      // backgroundColor: '#ddd',
                      borderRadius: 15,
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        alignSelf: 'flex-start',
                      }}>
                      {item.user_name}
                    </Text>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        width: '100%',
                        marginLeft: 8,
                      }}>
                      <Rating
                        readonly={true}
                        type="star"
                        ratingColor="#3498db"
                        ratingBackgroundColor="#fff"
                        ratingCount={5}
                        imageSize={18}
                        startingValue={item.rate_no}
                        style={{paddingRight: 10}}
                      />
                      <View style={{marginLeft: 10}}>
                        <Text>{this.getDate(item.date)}</Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        paddingRight: 20,
                        paddingLeft: 10,
                        fontSize: 14,
                        alignSelf: 'flex-start',
                        marginBottom: 10,
                      }}>
                      {item.review_text}
                    </Text>
                  </View>
                </>
              ))}
            </ScrollView>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          // presentationStyle={"fullScreen"}
          // statusBarTranslucent={true}
          visible={this.state.model_erorrs}
          onRequestClose={() => {
            this.setState({model_erorrs: false});
          }}>
          <View style={{flex: 1}}>
            <View
              style={{
                height: height,
                width: width,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: '80%',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  elevation: 5,
                  paddingVertical: 10,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: '#2fcc70',
                    // fontWeight: 'bold',
                    fontFamily: 'Janna LT Bold',
                    fontSize: 22,
                    textAlign: 'center',
                    marginBottom: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd',
                  }}>
                  Teslm
                </Text>
                <Text
                  style={{
                    padding: 15,
                    fontSize: 16,
                    marginBottom: 5,

                    fontFamily: 'Janna LT Bold',
                    textAlign: 'center',
                  }}>
                  {this.state.worning_text}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '90%',
                      margin: '5%',
                      alignSelf: 'center',
                      padding: 5,
                      backgroundColor: '#2fcc70',
                      borderRadius: 50,
                      elevation: 3,
                      // marginBottom: 20,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      this.setState({model_erorrs: false});
                    }}>
                    <Text
                      style={{
                        // fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: 18,
                        fontFamily: 'Janna LT Bold',
                      }}>
                      حسناً
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  itemsStyles: {
    width: '100%',
    marginTop: 20,
    // margin: '5%',
  },
  itemsContentStyles: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 15,
    backgroundColor: '#fff',
    // borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    shadowOffset: {width: 10, height: 10},
    shadowColor: '#ddd',
    shadowOpacity: 0.8,
  },
  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  header: {
    height: HEADER_MAX_HEIGHT,

    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2fcc70',
    overflow: 'hidden',
  },
  bar: {
    flexDirection: 'row',
    height: HEADER_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
  oreder_product: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // flexWrap: 'wrap',
  },
  header_text_style: {
    width: '50%',
    fontSize: 18,
    fontFamily: 'Metropolis',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
