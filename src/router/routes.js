const routes = [
    // 🔒 Auth Layout: used for login
    {
        path: '/login',
        component: () =>
            import ('layouts/AuthLayout.vue'), // ⬅️ no sidebar layout
        children: [{
            path: '',
            component: () =>
                import ('pages/LoginPage.vue')
        }]
    },

    // Main Layout (with sidebar) for logged-in pages
    {
        path: '/',
        component: () =>
            import ('layouts/MainLayout.vue'), // ⬅️ has sidebar/header
        children: [{
                path: '',
                redirect: '/dashboard'
            },
            {
                path: 'dashboard',
                component: () =>
                    import ('pages/DashboardPage.vue')
            },
            {
                path: 'assignments',
                component: () =>
                    import ('pages/AllAssignments.vue')
            },
            {
                path: 'createEvents',
                component: () =>
                    import ('pages/CreateEvent.vue')
            },
            {
                path: 'editEvents/:id',
                component: () =>
                    import ('pages/EditEvent.vue')
            },
            {
                path: 'listingSubEvent/:id',
                component: () =>
                    import ('pages/ListingSubEvents.vue')
            },
            {
                path: 'createSubEvent/:id',
                component: () =>
                    import ('pages/CreateSubEvent.vue')
            },
            {
                path: 'editSubEvent/:event_id/:sub_event_id',
                component: () =>
                    import ('pages/EditSubEvent.vue')
            },
            {
                path: 'listingDeliverables/:event_id',
                name: 'listing-deliverables',
                component: () =>
                    import ('pages/ListingDeliverables.vue')
            },
            {
                path: 'createDeliverable/:event_id',
                name: 'create-deliverable',
                component: () =>
                    import ('pages/CreateDeliverable.vue')
            },
            {
                path: 'editDeliverable/:id',
                name: 'edit-deliverable',
                component: () =>
                    import ('pages/EditDeliverable.vue')
            },
            {
                path: 'event-payments/:event_id',
                name: 'event-payment-list',
                component: () =>
                    import ('pages/PaymentList.vue'),
            },
            {
                path: '/create-event-payment/:event_id',
                name: 'create-event-payment',
                component: () =>
                    import ('pages/CreatePayment.vue'),
            },
            {
                path: '/edit-event-payment/:id',
                name: 'edit-event-payment',
                component: () =>
                    import ('pages/EditPayment.vue'),
            },
            {
                path: '/event-sub-event-data-info/:event_id',
                name: 'event-sub-event-data-info',
                component: () =>
                    import ('pages/EventSubEventDataInfo.vue'),
            },
            {
                path: '/deliverable-task-details/:event_id',
                name: 'deliverable-task-details',
                component: () =>
                    import ('pages/TaskDetails.vue'),
            },
            {
                path: '/create-deliverable-task/:event_id',
                name: 'create-deliverable-task',
                component: () =>
                    import ('pages/CreateTask.vue'),
            },
            {
                path: '/edit-deliverable-task/:id',
                name: 'edit-deliverable-task',
                component: () =>
                    import ('pages/EditTask.vue'),
            },
            {
                path: 'photo-crm-agreement/:event_id',
                name: 'photo-crm-agreement',
                component: () =>
                    import ('pages/AgreementPage.vue')
            },
            {
                path: 'contact-details',
                name: 'contact-details',
                component: () =>
                    import ('pages/ContactDetails.vue')
            },
            {
                path: 'create-contact',
                name: 'create-contact',
                component: () =>
                    import ('pages/CreateContact.vue')
            },
            {
                path: 'edit-contact/:id',
                name: 'edit-contact',
                component: () =>
                    import ('pages/EditContact.vue')
            },
            {
                path: 'lead-details',
                name: 'lead-details',
                component: () =>
                    import ('pages/LeadDetails.vue')
            },
            {
                path: 'create-lead/:id',
                name: 'create-lead',
                component: () =>
                    import ('pages/CreateLead.vue')
            },
            {
                path: 'edit-lead/:id',
                name: 'edit-lead',
                component: () =>
                    import ('pages/EditLead.vue')
            },
            {
                path: 'team-info',
                name: 'team-info',
                component: () =>
                    import ('pages/TeamInfo.vue')
            },
            {
                path: 'create-team',
                name: 'create-team',
                component: () =>
                    import ('pages/CreateTeam.vue')
            },
            {
                path: 'edit-team/:id',
                name: 'edit-team',
                component: () =>
                    import ('pages/EditTeam.vue')
            },
            {
                path: 'vendor-info',
                name: 'vendor-info',
                component: () =>
                    import ('pages/VendorInfo.vue')
            },
            {
                path: 'create-vendor',
                name: 'create-vendor',
                component: () =>
                    import ('pages/CreateVendor.vue')
            },
            {
                path: 'edit-vendor/:id',
                name: 'edit-vendor',
                component: () =>
                    import ('pages/EditVendor.vue')
            },









        ]
    },

    // ❌ 404 fallback
    {
        path: '/:catchAll(.*)*',
        component: () =>
            import ('pages/ErrorNotFound.vue')
    }
]

export default routes