import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { CardComponent } from './card/card.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NotfondcomponentComponent } from './notfondcomponent/notfondcomponent.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { ProductsCategoryComponent } from './products-category/products-category.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AuthGuard } from '../../auth.guard';
import { AdminComponent } from './admin/admin.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { EditComponent } from './edit/edit.component';
import { OrdersComponent } from './orders/orders.component';
export const routes: Routes = [
    {
        path: '',
        component: IndexPageComponent
    },
    {
        path: 'products',
        component: MainPageComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin-login',
        component: AdminLoginComponent
    },
    {
        path: 'registration',
        component: RegistrationComponent
    },
    {
        path: 'editProduct/:id',
        component: EditComponent
    },
    {
        path: 'card',
        component: CardComponent
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'allproducts', component: AllProductsComponent },
            { path: 'addProduct', component: AddProductComponent }
        ]
    },
    {
        path: 'product-details/:id',
        component: ProductDetailsComponent
    },
    {
        path: 'category-products/:category',
        component: ProductsCategoryComponent
    },
    {
        path: 'favorites',
        component: FavoritesComponent
    },
    {
        path: 'orders',
        component: OrdersComponent
    },

    {
        path: '**',
        component: NotfondcomponentComponent
    }
];
