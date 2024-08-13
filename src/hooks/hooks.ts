import { useDispatch, useSelector, useStore } from 'react-redux'
import {EffectCallback, useEffect} from "react";
import {AppDispatch, RootState} from "@/data/types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes()
