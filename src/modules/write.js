import { createAction, handleActions } from "redux-actions";
import createRequestSaga,{
    createRequestActionTypes,
}from'../lib/createRequestSaga';
import * as postsAPI from '../lib/api/posts';
import { takeLatest } from "redux-saga/effects";

const INITIALIZE='write/INITIALIZE'; //모든 내용 초기화
const CHANGE_FIELD= 'write/CHANGE_FIELD'; //특정 key값 바꾸기
const [
    WRITE_POST,
    WRITE_POST_SUCCESS,
    WRITE_POST_FAILURE,
]=createRequestActionTypes('write/WRITE_POST');

export const initialize= createAction(INITIALIZE);
export const changeField=createAction(CHANGE_FIELD,({key,value})=>({
    key,
    value,
}));
export const writePost =createAction(WRITE_POST,({title,body,tags})=>({
    title,
    body,
    tags,
}));

//사가 생성
const writePostSaga=createRequestSaga(WRITE_POST,postsAPI.writePost);
export function* writeSaga(){
    yield takeLatest(WRITE_POST,writePostSaga);
}

const initialState={
    title:'',
    body:'',
    tags:[],
    post:null,
    postError:null,
};

const write =handleActions(
    {
        [INITIALIZE]:state=>initialState,//initialstate를 넣으면 초기 상태로 바뀜
        [CHANGE_FIELD]: (state, {payload:{key,value}})=>({
            ...state,
            [key]:value,
        }),
        [WRITE_POST]:state=>({
            ...state,
            //post, postError를 초기화 
            post: null,
            postError:null,
        }),
        //포스트 작성 성공
        [WRITE_POST_SUCCESS]:(state,{payload:post})=>({
            ...state,
            post,
        }),
        //post 실패
        [WRITE_POST_FAILURE]:(state,{payload:postError})=>({
            ...state,
            postError,
        }),
    },
    initialState,
);
export default write;