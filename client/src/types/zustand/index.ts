


type AppStoreStatesType = {
    isSidebarOpen: boolean
    isAIModalOpen: boolean
}


type AppStoreActionsType = {
    toggleSidebar: () => void
    toggleAIModal: () => void
}


export type {
    AppStoreStatesType,
    AppStoreActionsType
}