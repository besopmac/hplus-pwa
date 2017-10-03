import {Component} from "@angular/core";
import {NavController, MenuController, ModalController, PopoverController} from "ionic-angular";
import {HotelService} from "../../services/hotel-service";
import {HotelDetailPage} from "../hotel-detail/hotel-detail";
import {NotificationsPage} from "../notifications/notifications";
import {SearchCarsPage} from "../search-cars/search-cars";
import {SearchTripsPage} from "../search-trips/search-trips";
import {HotelPage} from "../hotel/hotel";
import {AccountPage} from "../account/account";

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dDate: Date = new Date();
  searchQuery: string = '';
  items: string[];
  showItems: boolean = false;

  public map: any;
  public childs: any;

  public hotellocation: string;

  // list of hotels
  public hotels: any;

  // search conditions
  public checkin = {
    name: "Check-in",
    date: this.dDate.toISOString()
  }

  public checkout = {
    name: "Check-out",
    date: new Date(this.dDate.setDate(this.dDate.getDate() + 1)).toISOString()
  }

  constructor(public nav: NavController, public menuCtrl: MenuController, public modalCtrl: ModalController, public popoverCtrl: PopoverController, public hotelService: HotelService) {
    // set sample data
    this.menuCtrl.swipeEnable(true, 'authenticated');
    this.hotels = hotelService.getAll();
  }

  ionViewDidLoad() {
    // init map
    this.initializeMap();
  }

  initializeMap() {
    let latLng = new google.maps.LatLng(this.hotels[0].location.lat, this.hotels[0].location.lon);

    let mapOptions = {
      center: latLng,
      zoom: 11,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false
    }

    this.map = new google.maps.Map(document.getElementById("home-map"), mapOptions);

    // add markers to map by hotel
    for (let i = 0; i < this.hotels.length; i++) {
      let hotel = this.hotels[i];
      new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(hotel.location.lat, hotel.location.lon)
      });
    }

    // refresh map
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 300);
  }  

  initializeItems() {
    this.items = [
      'La Belle Place - Rio de Janeiro',
      'Marshall Hotel - Marshall Islands',
      'Maksoud Plaza - São Paulo',
      'Hotel Copacabana - Rio de Janeiro',
      'Pousada Marés do amanhã - Maragogi'
    ];
  }

  itemSelected(item: string) {
    this.hotellocation = item;
    this.showItems = false;
  }

  childrenArr(chil) {
    let child = Number(chil);
    this.childs = Array(child).fill(0).map((v,i) => i);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.showItems = true;
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.showItems = false;
    }
  }

  // view hotel detail
  viewHotel(hotelId) {
    this.nav.push(HotelDetailPage, {id: hotelId});
  }

  // view all hotels
  viewHotels() {
    this.nav.push(HotelPage);
  }

  // go to search car page
  searchCar() {
    this.nav.push(SearchCarsPage);
  }

  // go to search trip page
  searchTrip() {
    this.nav.push(SearchTripsPage);
  }

  // to go account page
  goToAccount() {
    this.nav.push(AccountPage);
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create(NotificationsPage);
    popover.present({
      ev: myEvent
    });
  }

}

// 
