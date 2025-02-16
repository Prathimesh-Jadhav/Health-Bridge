import React from 'react'

export const AppContext = React.createContext();

const GlobalContext = ({children}) => {
    const [pageTitle, setPageTitle] = React.useState('');
    const [user,setUser] = React.useState('admin');
    const [detailsPageData,setDetailsPageData] = React.useState({});
  return (
    <AppContext.Provider value={{pageTitle, setPageTitle,user,setUser,detailsPageData,setDetailsPageData}}>
        {children}
    </AppContext.Provider>
  )
}

export default GlobalContext
