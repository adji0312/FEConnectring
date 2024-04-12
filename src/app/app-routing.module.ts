import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { OrderComponent } from './cart/order/order.component';
import { CateringComponent } from './catering/catering/catering.component';
import { DetailCateringComponent } from './catering/catering/detailCatering/detail-catering/detail-catering.component';
import { DetailPackageComponent } from './catering/catering/detailPackage/detail-package/detail-package.component';
import { ChatComponent } from './chat/chat/chat.component';
import { GroupComponent } from './group/group/group.component';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './login/login.component';
import { MerchantDashboardComponent } from './merchant/dashboard/merchant-dashboard/merchant-dashboard.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { RegisterComponent } from './register/register/register.component';
import { PackageComponent } from './package/package/package.component';
import { InvoiceComponent } from './invoice/invoice/invoice.component';
import { DetailOrderComponent } from './cart/order/DetailOrder/detail-order/detail-order.component';
import { AddPackageComponent } from './package/addPackage/add-package/add-package.component';
import { DetailChatComponent } from './chat/detail-chat/detail-chat.component';
import { ListCustomerComponent } from './admin/customer-list/list-customer/list-customer.component';

const routes: Routes = [
  {path: "", redirectTo:"login", pathMatch:"full"},
  {path: "login", component:LoginComponent},
  {path: "home", component:HomeComponent, canActivate: [AuthGuard]},
  {path: "allCatering", component:CateringComponent, canActivate: [AuthGuard]},
  {path: "detailCatering", component:DetailCateringComponent, canActivate: [AuthGuard]},
  {path: "invoice", component:InvoiceComponent, canActivate: [AuthGuard]},
  {path: "chat", component:ChatComponent, canActivate: [AuthGuard]},
  {path: "detailChat", component:DetailChatComponent, canActivate: [AuthGuard]},
  {path: "group", component:GroupComponent, canActivate: [AuthGuard]},
  {path: "order", component:OrderComponent, canActivate: [AuthGuard]},
  {path: "profile", component:ProfileComponent, canActivate: [AuthGuard]},
  {path: "register", component:RegisterComponent},
  {path: "detailPackage", component:DetailPackageComponent, canActivate: [AuthGuard]},
  {path: "admin-dashboard", component:AdminDashboardComponent, canActivate: [AuthGuard]},
  {path: "list-customers", component:ListCustomerComponent, canActivate: [AuthGuard]},
  {path: "merchant-dashboard", component:MerchantDashboardComponent, canActivate: [AuthGuard]},
  {path: "package", component:PackageComponent, canActivate: [AuthGuard]},
  {path: "orderDetail", component:DetailOrderComponent, canActivate: [AuthGuard]},
  {path: "addPackage", component:AddPackageComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
