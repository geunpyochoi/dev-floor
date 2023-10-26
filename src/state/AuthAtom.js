import { atom } from "recoil";

// login
export const emailState = atom({
    key: 'emailState',
    default: ''
})  
export const passwordState = atom({
    key: 'pwState',
    default: ''
})  
export const errorState = atom({
    key: 'errorState',
    default: ''
})  
export const tokenState = atom({
    key: 'tokenState',
    default: localStorage.getItem('token') || ''
}) 
// join
export const preDataState = atom({
    key: 'preDataState',
    default: {
        email: '',
        password: '',
        username: '',
        accountname: '',
        intro: '',
        image: 'https://api.mandarin.weniv.co.kr/Ellipse.png',
    },
});
// export const userNameState = atom({
//     key: 'userNameState',
//     default: ''
// })
// export const accountNameState = atom({
//     key: 'accountNameState',
//     default: ''
// })
// export const introState = atom({
//     key: 'introState',
//     default: ''
// })
// export const imageState = atom({
//     key: 'imageState',
//     default: 'https://api.mandarin.weniv.co.kr/Ellipse.png'
// })
// export const emailValidState = atom({
//     key: 'emailValidState',
//     default: true
// })
export const routeState = atom({
    key: 'routeState',
    default: 'signup'
})