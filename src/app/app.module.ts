import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthGuard } from './auth/auth.guard';
import { LoginAuthService } from './auth/login-auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Toast, ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { HomeComponent } from './home/home/home.component';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { CateringComponent } from './catering/catering/catering.component';
import { DetailCateringComponent } from './catering/catering/detailCatering/detail-catering/detail-catering.component';
import { ChatComponent } from './chat/chat/chat.component';
import { GroupComponent } from './group/group/group.component';
import { OrderComponent } from './cart/order/order.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { RegisterComponent } from './register/register/register.component';
import { DetailPackageComponent } from './catering/catering/detailPackage/detail-package/detail-package.component';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard/admin-dashboard.component';
import { MerchantDashboardComponent } from './merchant/dashboard/merchant-dashboard/merchant-dashboard.component';
import { MerchantComponent } from './user/merchant/merchant/merchant.component';
import { CustomerComponent } from './user/customer/customer/customer.component';
import { PackageComponent } from './package/package/package.component';
import { InvoiceComponent } from './invoice/invoice/invoice.component';
import { FooterComponent } from './footer/footer/footer.component';
import { DetailOrderComponent } from './cart/order/DetailOrder/detail-order/detail-order.component';
import { AddPackageComponent } from './package/addPackage/add-package/add-package.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DetailChatComponent } from './chat/detail-chat/detail-chat.component';
import { ListCustomerComponent } from './admin/customer-list/list-customer/list-customer.component';
import { OrderPipe } from './cart/order/order.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SearchFoodPipe } from './package/search-food.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    CateringComponent,
    DetailCateringComponent,
    ChatComponent,
    GroupComponent,
    OrderComponent,
    ProfileComponent,
    RegisterComponent,
    DetailPackageComponent,
    AdminDashboardComponent,
    MerchantDashboardComponent,
    MerchantComponent,
    CustomerComponent,
    PackageComponent,
    InvoiceComponent,
    FooterComponent,
    DetailOrderComponent,
    AddPackageComponent,
    DetailChatComponent,
    ListCustomerComponent,
    OrderPipe,
    SearchFoodPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCqsl25tNFTb4uXkAtmA5ZedtgwsqwHR_8",
      authDomain: "connectring-418e9.firebaseapp.com",
      projectId: "connectring-418e9",
      storageBucket: "connectring-418e9.appspot.com",
      messagingSenderId: "5258632021",
      appId: "1:5258632021:web:fea848aa85dfa9c19d6ddc"
    }),
    AngularFireStorageModule,
    NgMultiSelectDropDownModule.forRoot(),
    TooltipModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    UiSwitchModule.forRoot({
      size: 'medium',
      color: '#E5E5E5',
      switchColor: '#FFFFFF',
      defaultBgColor: '#27187E',
      uncheckedTextColor: '#E5E5E5',
      checkedLabel: 'ID',
      uncheckedLabel: 'EN'
    }),
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    AuthGuard,
    LoginAuthService
  ],
  schemas: [
    NO_ERRORS_SCHEMA // Add NO_ERRORS_SCHEMA here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
