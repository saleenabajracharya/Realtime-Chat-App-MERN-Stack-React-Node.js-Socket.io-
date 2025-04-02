import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Form } from './modules/form'
import { Dashboard } from './modules/Dashboard/INDEX.JSX'
import { Routes , Route, Navigate} from 'react-router'

const ProtectedRoutes = ({children, auth = false}) =>{
  const isLoggedIn = localStorage.getItem('user:token') !== null || false
  if(!isLoggedIn && auth){
    return <Navigate to={'/users/sign-in'} />
  }else if (isLoggedIn && ['/users/sign-in','/users/sign-up'].includes(window.location.pathname)){
    return <Navigate to={'/'}/>
  }
  return children
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path = '/users/sign-in' element = {
        <ProtectedRoutes>
        <Form isSignInPage = {true}/>
        </ProtectedRoutes>}/>
      <Route path = '/users/sign-up' element = {
        <ProtectedRoutes><Form isSignInPage = {false}/></ProtectedRoutes>}/>
      <Route path = '/' element = {
        <ProtectedRoutes auth={true}> 
        <Dashboard/>
        </ProtectedRoutes>}/>
    </Routes>
    
  )
}

export default App
