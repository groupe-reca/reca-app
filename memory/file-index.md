# Index de fichiers par module

Table de référence : quels fichiers appartiennent à quel module. À consulter EN PREMIER pour toute tâche touchant un module existant, avant toute exploration/grep du repo (voir CLAUDE.md §6).

Convention de chaque module : `types/`, `schemas/`, `services/`, `hooks/`, `components/`, `pages/` (tous les dossiers ne sont pas toujours présents).

## auth
- types: `src/features/auth/types/auth.types.ts`
- schemas: `src/features/auth/schemas/login.schema.ts`
- services: `src/features/auth/services/auth.service.ts`
- hooks: `src/features/auth/hooks/useLogin.ts`, `useLogout.ts`, `useSession.ts`
- components: `src/features/auth/components/LoginForm.tsx`, `RequireAuth.tsx`
- pages: `src/features/auth/pages/LoginPage.tsx`

## leads
- types: `src/features/leads/types/lead.types.ts`
- schemas: `src/features/leads/schemas/lead.schema.ts`
- services: `src/features/leads/services/leads.service.ts`
- hooks: `src/features/leads/hooks/leadKeys.ts`, `useCreateLead.ts`, `useDeleteLead.ts`, `useLeads.ts`, `useLead.ts`, `useScheduleReminder.ts`, `useUpdateLeadStatus.ts`, `useUpdateLead.ts`
- components: `src/features/leads/components/LeadFormModal.tsx`, `LeadForm.tsx`, `LeadReminderCard.tsx`, `LeadStatusBadge.tsx`, `LeadTable.tsx`
- pages: `src/features/leads/pages/LeadCreatePage.tsx`, `LeadDetailPage.tsx`, `LeadsListPage.tsx`

## quotes
- types: `src/features/quotes/types/quote.types.ts`
- schemas: `src/features/quotes/schemas/quote.schema.ts`
- services: `src/features/quotes/services/quotes.service.ts`
- hooks: `src/features/quotes/hooks/quoteKeys.ts`, `useConvertQuoteToClient.ts`, `useCreateQuote.ts`, `useDeleteQuote.ts`, `useQuotes.ts`, `useQuote.ts`, `useUpdateQuoteStatus.ts`, `useUpdateQuote.ts`
- components: `src/features/quotes/components/QuoteFormModal.tsx`, `QuoteForm.tsx`, `QuoteStatusBadge.tsx`, `QuoteTable.tsx`
- pages: `src/features/quotes/pages/QuoteCreatePage.tsx`, `QuoteDetailPage.tsx`, `QuotesListPage.tsx`

## clients
- types: `src/features/clients/types/client.types.ts`
- schemas: `src/features/clients/schemas/client.schema.ts`
- services: `src/features/clients/services/clients.service.ts`
- hooks: `src/features/clients/hooks/clientKeys.ts`, `useClients.ts`, `useClient.ts`, `useCreateClient.ts`, `useDeleteClient.ts`, `useUpdateClient.ts`
- components: `src/features/clients/components/ClientFormModal.tsx`, `ClientForm.tsx`, `ClientSearchPicker.tsx`, `ClientTable.tsx`
- pages: `src/features/clients/pages/ClientCreatePage.tsx`, `ClientDetailPage.tsx`, `ClientsListPage.tsx`

## contracts
- types: `src/features/contracts/types/contract.types.ts`
- schemas: `src/features/contracts/schemas/contractCreation.schema.ts`, `contract.schema.ts`
- services: `src/features/contracts/services/contracts.service.ts`, `geocoding.service.ts`
- hooks: `src/features/contracts/hooks/contractKeys.ts`, `useClientContracts.ts`, `useContracts.ts`, `useContract.ts`, `useCreateContractWithInvoices.ts`, `useDeleteContract.ts`, `useUpdateContractStatus.ts`, `useUpdateContract.ts`, `usePropertyCapture.ts` (ex-composant `CaptureButton.tsx` transformé en hook, sprint008.5), `useZoneTypeSelection.ts` (nouveau, sprint009 — extrait dans son propre fichier pour respecter la règle Fast Refresh un-seul-export-composant-par-fichier)
- components: `src/features/contracts/components/ContractBasicInfoFields.tsx`, `ContractFormModal.tsx`, `ContractForm.tsx`, `ContractStatusBadge.tsx`, `ContractTable.tsx`, `PaymentScheduleBuilder.tsx`, `TextareaField.tsx`
- components/wizard: `src/features/contracts/components/wizard/ContractWizard.tsx`, `PolygonEditor.tsx` (sprint009 — réécrit en composant piloté par ref, `forwardRef`/`useImperativeHandle`), `PropertyMap.tsx`, `PropertyBoundaryLayer.tsx`, `PropertyMaskLayer.tsx`, `MapViewportController.tsx`, `PropertyMapStage.tsx` (vue carte partagée Localiser/Délimiter), `PropertyInfoPanel.tsx`, `PropertyZonesPanel.tsx` (panneau gauche de Délimiter), `PropertySubStepDelineate.tsx`, `PropertySubStepLocate.tsx`, `PropertySubStepValidate.tsx`, `SurfaceSummary.tsx`, `WizardStepClient.tsx`, `WizardStepObligations.tsx`, `WizardStepPayment.tsx`, `WizardStepProperty.tsx`, `WizardStepServices.tsx`, `WizardStepValidation.tsx`, `ZoneToolbar.tsx` (nouveau, sprint009), `ZoneTypeSelector.tsx` (nouveau, sprint009), `ZoneNamingModal.tsx` (nouveau, sprint009), `PolygonCard.tsx` (nouveau, sprint009 — ligne zone partagée, réutilisée par `PolygonList`/`SurfaceSummary`), `PolygonList.tsx` (nouveau, sprint009), `ZoneAreaSummary.tsx` (nouveau, sprint009)
- constants: `src/features/contracts/constants/wizardOptions.ts` (sprint009 — `ZONE_TYPE_OPTIONS`/`ZONE_TYPE_COLORS` remplacent `ZONE_NAME_OPTIONS`), `zoneDrawStyles.ts` (nouveau, sprint009 — thème Mapbox GL Draw coloré par type)
- pages: `src/features/contracts/pages/ContractDetailPage.tsx`, `ContractsListPage.tsx`, `ContractWizardPage.tsx`
- utils: `src/features/contracts/utils/generateClauses.ts`, `paymentPresets.ts`, `propertyBoundary.ts` (dont `boundsFromPolygon`, réutilisé par sprint009 pour "Zoomer")

## invoices
- types: `src/features/invoices/types/invoice.types.ts`
- schemas: `src/features/invoices/schemas/invoice.schema.ts`
- services: `src/features/invoices/services/invoices.service.ts`
- hooks: `src/features/invoices/hooks/invoiceKeys.ts`, `useClientInvoices.ts`, `useContractInvoices.ts`, `useCreateInvoice.ts`, `useDeleteInvoice.ts`, `useInvoices.ts`, `useInvoice.ts`, `useUpdateInvoiceStatus.ts`, `useUpdateInvoice.ts`
- components: `src/features/invoices/components/InvoiceFormModal.tsx`, `InvoiceForm.tsx`, `InvoiceStatusBadge.tsx`, `InvoiceTable.tsx`
- pages: `src/features/invoices/pages/InvoiceCreatePage.tsx`, `InvoiceDetailPage.tsx`, `InvoicesListPage.tsx`

## payments
- types: `src/features/payments/types/payment.types.ts`
- schemas: `src/features/payments/schemas/payment.schema.ts`
- services: `src/features/payments/services/payments.service.ts`
- hooks: `src/features/payments/hooks/paymentKeys.ts`, `useCreatePayment.ts`, `useDeletePayment.ts`, `useInvoicePayments.ts`, `usePayments.ts`
- components: `src/features/payments/components/PaymentFormModal.tsx`, `PaymentForm.tsx`, `PaymentTable.tsx`
- pages: `src/features/payments/pages/PaymentsListPage.tsx`

## equipments
*(dossier réel `src/features/equipments/`, pluriel — pas `equipment`)*
- types: `src/features/equipments/types/equipment.types.ts`
- schemas: `src/features/equipments/schemas/equipment.schema.ts`
- services: `src/features/equipments/services/equipments.service.ts`
- hooks: `src/features/equipments/hooks/equipmentKeys.ts`, `useCreateEquipment.ts`, `useUpdateEquipmentStatus.ts`, `useEquipment.ts`, `useEquipments.ts`, `useUpdateEquipment.ts`, `useDeleteEquipment.ts`
- components: `src/features/equipments/components/EquipmentFormModal.tsx`, `EquipmentForm.tsx`, `EquipmentTable.tsx`, `EquipmentStatusBadge.tsx`
- pages: `src/features/equipments/pages/EquipmentCreatePage.tsx`, `EquipmentsListPage.tsx`, `EquipmentDetailPage.tsx`

## employees
- types: `src/features/employees/types/employee.types.ts`
- schemas: `src/features/employees/schemas/employee.schema.ts`
- services: `src/features/employees/services/employeeAccount.service.ts`, `employeeEquipment.service.ts`, `employees.service.ts`
- hooks: `src/features/employees/hooks/employeeKeys.ts`, `useAssignEquipment.ts`, `useCreateEmployee.ts`, `useDeleteEmployee.ts`, `useEmployeeAccount.ts`, `useEmployeeEquipment.ts`, `useEmployees.ts`, `useEmployee.ts`, `usePromoteEmployeeAccount.ts`, `useUnassignEquipment.ts`, `useUpdateEmployee.ts`
- components: `src/features/employees/components/EmployeeFormModal.tsx`, `EmployeeForm.tsx`, `EmployeeTable.tsx`
- pages: `src/features/employees/pages/EmployeeCreatePage.tsx`, `EmployeeDetailPage.tsx`, `EmployeesListPage.tsx`

## routes
- types: `src/features/routes/types/route.types.ts`
- schemas: `src/features/routes/schemas/route.schema.ts`
- services: `src/features/routes/services/routeAssignments.service.ts`, `routeClients.service.ts`, `routes.service.ts`
- hooks: `src/features/routes/hooks/routeKeys.ts`, `useAddRouteClient.ts`, `useCreateRouteAssignment.ts`, `useCreateRoute.ts`, `useDeleteRouteAssignment.ts`, `useDeleteRoute.ts`, `useRemoveRouteClient.ts`, `useReorderRouteClient.ts`, `useRouteAssignments.ts`, `useRouteClients.ts`, `useRoutes.ts`, `useRoute.ts`, `useUpdateAssignmentStatus.ts`, `useUpdateRouteStatus.ts`, `useUpdateRoute.ts`
- components: `src/features/routes/components/RouteFormModal.tsx`, `RouteForm.tsx`, `RouteStatusBadge.tsx`, `RouteTable.tsx`
- pages: `src/features/routes/pages/RouteCreatePage.tsx`, `RouteDetailPage.tsx`, `RoutesListPage.tsx`

## settings
- types: `src/features/settings/types/settings.types.ts`
- schemas: `src/features/settings/schemas/settings.schema.ts`
- services: `src/features/settings/services/accounts.service.ts`, `settings.service.ts`
- hooks: `src/features/settings/hooks/settingsKeys.ts`, `useAccounts.ts`, `useSettings.ts`, `useUpdateAccountActive.ts`, `useUpdateAccountRole.ts`, `useUpdateModules.ts`, `useUpdateSettings.ts`
- components: `src/features/settings/components/AccountsTable.tsx`, `CompanySettingsForm.tsx`, `ModulesTable.tsx`
- pages: `src/features/settings/pages/SettingsPage.tsx`

## Partagé / transverse
- `src/components/layout/` : `ModuleContainer.tsx`, `PageLayout.tsx`, `PageTabs.tsx`, `StickyPageFooter.tsx`, `StickyPageHeader.tsx`, `WizardFooter.tsx`, `WizardLayout.tsx`, `WizardProgress.tsx`
- `src/components/ui/` : `Badge.tsx`, `Button.tsx`, `Card.tsx`, `Dropdown.tsx`, `Input.tsx`, `Modal.tsx`, `QueryState.tsx`, `Select.tsx`, `Table.tsx`, `Toaster.tsx`, `Tooltip.tsx`, `useTableState.ts`
- `src/hooks/` : `useBodyScrollLock.ts`, `useBreakpoint.ts`, `useElementSize.ts`, `useFocusTrap.ts`, `useMapboxMap.ts`
- `src/layouts/` : `AppLayout.tsx`, `Breadcrumb.tsx`, `PublicLayout.tsx`, `Sidebar.tsx`
- `src/routes/` : `RequireModule.tsx`, `router.tsx`
- `src/lib/` : `format.ts`, `mapboxClient.ts`, `queryClient.ts`, `storage.ts`, `supabaseClient.ts`, `supabaseCrud.ts`

## Maintenance
Cet index doit être mis à jour dans le protocole de fin de tâche (comme `tasks.md`/`memory.md`) dès qu'un fichier est ajouté, supprimé ou déplacé dans un module.
