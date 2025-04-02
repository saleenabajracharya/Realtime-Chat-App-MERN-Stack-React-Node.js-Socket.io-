import { Input } from "../../components/Input"
import { Button } from "../../components/Button"
import { useState } from "react"
import { useNavigate } from "react-router"
export const Form = ({
  
  isSignInPage = true,
}) => {
  const [data,setData] = useState({
    ...(!isSignInPage && {
      fullName : '',

    }), 
    email: '',
    password: ''
  })
  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    console.log('Data:',data);
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/api/${isSignInPage ? "login" : "register"}`,{
      method: 'POST',
      headers:{
        'content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    if(res.status === 400){
      alert('Invalid Credentials')
    }else{
    const resData = await res.json()
    console.log('data:',resData);
    if(resData.token){
      localStorage.setItem('user:token', resData.token);
      localStorage.setItem('user:detail', JSON.stringify(resData.user));
      navigate('/');
    }
  }
  }
    return (
      <div className="bg-[#edf3fc] min-h-screen flex justify-center items-center">
        <div className="bg-white w-[600px] h-[660px] shadow-lg rounded-lg flex flex-col justify-center items-center">
          <div className="text-4xl font-extrabold mb-3">Welcome {isSignInPage && "Back"}</div>
          <h4 className="text-xl font-light mb-10">{isSignInPage ? 'Sign in to get explored' : 'Sign up now to get started'}</h4>
          <form className="flex flex-col items-center w-full" action="" onSubmit={(e) => handleSubmit(e)}>
          {!isSignInPage && <Input label="Full Name" name="name" type="text" placeholder="Enter your full name" className="mb-6 w-[50%]" value={data.fullName} onChange={(e) => setData({...data, fullName: e.target.value})}/>}
          <Input label="Email" name="email" type="email" placeholder="Enter your email" className="mb-6 w-[50%]" value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
          <Input label="Password" name="password" type="password" placeholder="Enter your password" className="mb-10 w-[50%] " value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
          
          <Button className="w-1/2 mb-4 cursor-pointer" label={isSignInPage ? "Sign In" : "Sign Up"} type="submit" />
          <div className="text-m font-light">{isSignInPage ? "Don't have an account?" : "Already have an account?"} <span className="underline cursor-pointer text-[var(--primary-color)] text-m font-light" onClick={() => navigate(`/users/${isSignInPage ? "sign-up" : "sign-in"}`)}>{isSignInPage ? "Sign Up" : "Sign In"}</span></div>
          </form>
      </div>
     
    </div>
    )
  }
  