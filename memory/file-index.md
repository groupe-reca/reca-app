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
- schemas: `src/features/clients/schemas/client.schema.ts` (tâche 5 — `CLIENT_TYPES`/`ClientType` enum `residentiel`|`commercial` remplace le `typeClient` free-text, `entreprise` requis si commercial via `.refine()` ; tâche 7 — `telephone` obligatoire, plus `.optional()`)
- services: `src/features/clients/services/clients.service.ts`
- hooks: `src/features/clients/hooks/clientKeys.ts`, `useClients.ts`, `useClient.ts`, `useCreateClient.ts`, `useDeleteClient.ts`, `useUpdateClient.ts`
- components: `src/features/clients/components/ClientFormModal.tsx`, `ClientForm.tsx` (tâche 5 — sélecteur Résidentiel/Commercial en haut, Entreprise conditionnelle, adresse via `AddressAutocomplete`, latitude/longitude/notes gardés en `defaultValues` mais plus rendus), `ClientSearchPicker.tsx` (tâche 5 — badge type + adresse/téléphone formatés dans la vue "client sélectionné", réutilisé tel quel par le Wizard Contrats), `ClientTable.tsx`
- pages: `src/features/clients/pages/ClientCreatePage.tsx`, `ClientDetailPage.tsx`, `ClientsListPage.tsx`

## contracts
- types: `src/features/contracts/types/contract.types.ts` (tâche 5 — `ObligationsAnswers` réduit à 4 champs : `seuilDeclenchementCm`/`heurePremierPassage`/`depotNeige`/`permisMunicipalObtenu`, `plafond_saisonnier_cm`/`plafondSaisonnierCm` retirés ; `MODE_CONCLUSION`/`DEPOT_NEIGE` inchangés), `contractWizardDefaults.types.ts` (nouveau, tâche 5 — `ContractWizardDefaults`/`DEFAULT_CONTRACT_WIZARD_DEFAULTS`, paramètres par défaut du Wizard)
- schemas: `src/features/contracts/schemas/contractCreation.schema.ts` (tâche 5 — `contractFieldsShape` réduit à `adresseGeocodee/latitude/longitude/zones/photos/prix/modePaiement/modalitesPaiement/notes` ; `obligationsAnswersSchema`/`serviceEntrySchema` retirés, plus aucun champ `type`/`modeConclusion`/`saison`/dates/`renouvellement`/`services`/`obligations` — tous dérivés du client ou des paramètres par défaut), `contract.schema.ts` (formulaire d'édition post-création, indépendant, non touché par la tâche 5), `contractWizardDefaults.schema.ts` (nouveau, tâche 5)
- services: `src/features/contracts/services/contracts.service.ts` (tâche 5 — `fetchContractWizardSettings` remplace `fetchAssurancePoliceNo`, lit aussi `contract_wizard_defaults` ; `toWizardRowInput`/`upsertContractWithZones`/`createContractWithZones`/`saveContractDraft` prennent un `clientTypeLabel` en paramètre et construisent `services`/`obligations`/`saison`/dates entièrement depuis les défauts, plus depuis le formulaire), `geocoding.service.ts`, `contractWizardSettings.service.ts` (nouveau, tâche 5 — `getContractWizardDefaults`/`updateContractWizardDefaults`, interroge `settings` directement sans dépendre de `features/settings/`)
- hooks: `src/features/contracts/hooks/contractKeys.ts` (tâche 5 — `wizardDefaults()` ajouté), `useClientContracts.ts`, `useContracts.ts`, `useContract.ts`, `useCreateContractWithInvoices.ts` (tâche 5 — accepte `clientTypeLabel`), `useSaveContractDraft.ts` (tâche 5 — accepte `clientTypeLabel`), `useContractWizardDefaults.ts`/`useUpdateContractWizardDefaults.ts` (nouveaux, tâche 5), `useContractDraft.ts` (sprint014 — `useQueries` contrat+zones+photos pour la reprise), `useDeleteContract.ts`, `useUpdateContractStatus.ts`, `useUpdateContract.ts`, `usePropertyCapture.ts`, `usePropertyPhotos.ts` (sprint014 — upload photos), `useZoneTypeSelection.ts` (sprint009), `useDelineateState.ts` (sprint012), `usePropertyStepState.ts` (sprint012, étendu sprint014 avec `photos`/`addPhoto`/`removePhoto`)
- components: `ContractFormModal.tsx`, `ContractForm.tsx`, `ContractStatusBadge.tsx`, `ContractTable.tsx`, `PaymentScheduleBuilder.tsx`, `TextareaField.tsx`, `ContractWizardDefaultsForm.tsx` (nouveau, tâche 5 — formulaire des paramètres par défaut du Wizard). **`ContractBasicInfoFields.tsx` supprimé (tâche 5)** — plus aucun champ à porter, tous dérivés/déplacés.
- components/mobile: `src/features/contracts/components/mobile/MobileContractLayout.tsx`, `MobileWizardStepProperty.tsx`, `MobilePropertySubStepLocate.tsx`, `MobilePropertySubStepDelineate.tsx`, `PropertyInfoSheet.tsx`, `PropertyZonesSheet.tsx`, `ZoneToolbarFloating.tsx`, `ZoneDetailSheet.tsx` (tous sprint012)
- components/wizard: `src/features/contracts/components/wizard/ContractWizard.tsx` (tâche 5 — `openPropertyAnalysis` passé à `WizardStepClient`, plus de rendu `services`), `useContractWizardState.ts` (**vit ici, pas dans `hooks/`** — tâche 5 : `STEP_ORDER` 4 étapes `['client','property','terms','review']`, `propertyAnalysisRequested`/`openPropertyAnalysis`/`nextSkippingProperty` pour l'étape "Analyse & Zones" optionnelle, `clientTypeLabel` dérivé de `selectedClient.typeClient`), `AddressPreviewCard.tsx` (tâche 5 — restylée "Adresse Validée" verte + bouton "Outil de mesure" `onOpenMeasurementTool`, plus de titre "Adresse" rouge), `ContractSummaryPanel.tsx` (tâche 5 — `typeLabel` dérivé de `client.typeClient` au lieu d'un `useWatch('type')`), `PolygonEditor.tsx`, `PropertyMap.tsx`, `PropertyBoundaryLayer.tsx`, `PropertyMaskLayer.tsx`, `MapViewportController.tsx`, `PropertyMapStage.tsx`, `PropertyInfoPanel.tsx`, `PropertyInfoContent.tsx`, `PropertyZonesPanel.tsx`, `PropertyZonesContent.tsx`, `PropertySubStepDelineate.tsx`, `PropertySubStepLocate.tsx`, `PropertySubStepValidate.tsx`, `SurfaceSummary.tsx`, `WizardStepClient.tsx` (tâche 5 — réduit à `ClientSearchPicker`+`AddressPreviewCard`, prop `onOpenMeasurementTool`, plus de `ContractBasicInfoFields`/`register`/`control`/`errors`), `WizardStepTerms.tsx` (tâche 5 — renommé "Modalités de paiement" dans `STEP_LABELS`, bloc Obligations retiré entièrement, gagne `prix` (déplacé) et `notes` (déplacé), `dateDebut`/`modeConclusion` lus via `useContractWizardDefaults()` au lieu du form, "Mensuel" retiré des presets), `WizardStepProperty.tsx` (consomme `usePropertyStepState`), `WizardStepValidation.tsx` (tâche 5 — `type`/`services`/`obligations` ne sont plus des `useWatch` du form, lus depuis `client.typeClient` + `useContractWizardDefaults()`), `ZoneToolbar.tsx`, `ZoneTypeSelector.tsx`, `ZoneNamingModal.tsx`, `PolygonCard.tsx`, `PolygonList.tsx`, `ZoneAreaSummary.tsx`. **`WizardStepServices.tsx` supprimé (tâche 5, étape retirée)**.
- components/wizard/mobile: `src/features/contracts/components/wizard/mobile/MobileContractWizard.tsx` (tâche 5 — plus de case `services`, `onOpenMeasurementTool` passé à `WizardStepClient`)
- constants: `src/features/contracts/constants/wizardOptions.ts` (`SERVICE_OPTIONS`/`SEUIL_DECLENCHEMENT_OPTIONS`/`DEPOT_NEIGE_OPTIONS`/`MODE_CONCLUSION_OPTIONS`/`MODE_CONCLUSION_LABELS` désormais consommés par `ContractWizardDefaultsForm.tsx` en plus du Wizard ; `ZONE_TYPE_OPTIONS`/`ZONE_TYPE_COLORS`), `zoneDrawStyles.ts`, `contractStatusColors.ts`
- pages: `src/features/contracts/pages/ContractDetailPage.tsx` (dispatcher), `ContractsListPage.tsx` (dispatcher), `ContractWizardPage.tsx` (dispatcher), `ContractWizardSettingsPage.tsx` (nouveau, tâche 5 — page admin-only des paramètres par défaut, route `contracts/parametres`)
- pages/desktop: `src/features/contracts/pages/desktop/DesktopContractsListPage.tsx` (tâche 5 — icône ⚙️ admin-only vers `/contracts/parametres`), `DesktopContractDetailPage.tsx` (tâche 5 — ligne "Plafond saisonnier" retirée, colonne supprimée)
- pages/mobile: `src/features/contracts/pages/mobile/MobileContractsListPage.tsx` (tâche 5 — icône ⚙️ admin-only), `MobileContractDetailPage.tsx` (tâche 5 — même retrait "Plafond saisonnier")
- utils: `src/features/contracts/utils/generateClauses.ts` (tâche 5 — `obligationsClient` devient un texte fixe (`OBLIGATIONS_CLIENT_BASE`, plus de sentence-builder Q&R puisque balises/entrée libre/animaux/portail/autres particularités n'existent plus) — **à faire relire par un juriste avant production**), `computeSoftWarnings.ts`, `draftMapping.ts` (tâche 5 — `contractToFormValues` réduit aux champs restants du form, `DEFAULT_OBLIGATIONS` retiré), `paymentPresets.ts` (tâche 5 — `'mensuel'`/`buildMonthlySchedule` retirés, `PaymentPresetId` = `'annuel'|'deux_versements'`), `propertyBoundary.ts`

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
- types: `src/features/settings/types/settings.types.ts` (sprint014 — `assurancePoliceNo`/`assurance_police_no`)
- schemas: `src/features/settings/schemas/settings.schema.ts` (sprint014 — `assurancePoliceNo`)
- services: `src/features/settings/services/accounts.service.ts`, `settings.service.ts` (sprint014 — mapping `assurance_police_no`)
- hooks: `src/features/settings/hooks/settingsKeys.ts`, `useAccounts.ts`, `useSettings.ts`, `useUpdateAccountActive.ts`, `useUpdateAccountRole.ts`, `useUpdateModules.ts`, `useUpdateSettings.ts`
- components: `src/features/settings/components/AccountsTable.tsx`, `CompanySettingsForm.tsx` (sprint014 — champ "N° de police d'assurance"), `ModulesTable.tsx`
- pages: `src/features/settings/pages/SettingsPage.tsx`

## Partagé / transverse
- `src/components/layout/` : `ModuleContainer.tsx`, `PageLayout.tsx`, `PageTabs.tsx`, `StickyPageFooter.tsx`, `StickyPageHeader.tsx`, `WizardFooter.tsx` (sprint014 — `onDraft`/`draftDisabled` retirés, brouillon déplacé vers `WizardLayout.headerActions`), `WizardLayout.tsx` (sprint014 — `headerActions?`/`sidePanel?` optionnels ajoutés), `WizardProgress.tsx`
- `src/components/layout/mobile/` (sprint012 — Wizard mobile générique, réutilisable hors Contrats) : `FloatingActionBar.tsx` (sprint014 — `onDraft` rendu sur chaque étape, pas seulement la dernière), `MobileFooterInsetContext.ts` (hauteur du footer courant, lue par `BottomSheet` pour ne jamais se positionner par-dessus), `MobileStepLayout.tsx`, `MobileWizard.tsx`
- `src/components/ui/` : `AddressAutocomplete.tsx` (tâche 5 — champ adresse avec suggestions Mapbox à la frappe, dégrade en texte libre si `isMapboxConfigured` est faux, réutilisable partout où un champ adresse existe ; tâche 7 — `parseFeature()` combine `feature.address` (numéro civique) + `feature.text` (nom de rue), Mapbox les renvoie séparément pour les features `address`), `Avatar.tsx` (nouveau, sprint013 — initiales/photo, construit mais non branché ce sprint), `Badge.tsx` (sprint013 — `size` sm/md, couleurs déplacées vers `statusColors.ts`), `BottomSheet.tsx` (sprint012 — feuille du bas glissable/redimensionnable, coexiste avec `Modal.tsx`), `Button.tsx` (sprint013 — `fullWidth` additif, non branché ce sprint), `Card.tsx` (sprint013 — ombre au lieu de bordure dure, `variant="clickable"`/`chevron` additifs), `Dropdown.tsx`, `Input.tsx`, `ListRow.tsx` (nouveau, sprint013 — icône+titre+sous-titre+valeur/chevron, générique), `Modal.tsx`, `QueryState.tsx`, `Select.tsx`, `StatCard.tsx` (nouveau, sprint013 — carte KPI générique), `statusColors.ts` (nouveau, sprint013 — `StatusColor`/`STATUS_BG_CLASSES`/`STATUS_TEXT_CLASSES` partagés), `Table.tsx` (sprint013 — classes alignées sur le nouveau style Card), `Toaster.tsx`, `Tooltip.tsx`, `useTableState.ts`
- `src/hooks/` : `useBodyScrollLock.ts`, `useBreakpoint.ts`, `useDeviceTier.ts` (nouveau, sprint012 — `'mobile'|'desktop'`, wrapper sémantique au-dessus de `useBreakpoint`), `useElementSize.ts`, `useFocusTrap.ts`, `useMapboxMap.ts`
- `src/layouts/` : `AppLayout.tsx` (sprint012 — devient un dispatcher Desktop/Mobile), `Breadcrumb.tsx` (desktop uniquement, inchangé), `DesktopAppShell.tsx` (nouveau, sprint012 — ex-contenu d'`AppLayout.tsx`), `MobileAppShell.tsx` (nouveau, sprint012), `MobileBottomNavigation.tsx` (nouveau, sprint012), `MobileHeader.tsx` (nouveau, sprint012), `MobileHeaderActionsContext.tsx` (nouveau, sprint012 — composant Provider), `navItems.ts` (nouveau, sprint012 — `NAV_ITEMS`/`useVisibleNavItems` extraits de `Sidebar.tsx`, partagés), `PublicLayout.tsx`, `Sidebar.tsx` (desktop/tablette uniquement, comportement inchangé), `useMobileHeaderActions.ts` (nouveau, sprint012 — hooks, séparé du Provider pour Fast Refresh)
- `src/routes/` : `RequireModule.tsx`, `router.tsx`
- `src/lib/` : `format.ts`, `mapboxClient.ts`, `queryClient.ts`, `storage.ts`, `supabaseClient.ts`, `supabaseCrud.ts`

## Maintenance
Cet index doit être mis à jour dans le protocole de fin de tâche (comme `tasks.md`/`memory.md`) dès qu'un fichier est ajouté, supprimé ou déplacé dans un module.
