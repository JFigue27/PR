import { RouterConfig } from '@angular/router'
import { SupplierComponent } from './events/index'

export const appRoutes: RouterConfig = [
    { path: '404', component: SupplierComponent },
    { path: '', redirectTo: '/events', pathMatch: 'full' },

]