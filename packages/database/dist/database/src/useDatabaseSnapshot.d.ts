import { QueryKey, UseQueryOptions, UseQueryResult } from "react-query";
import { DatabaseReference, DataSnapshot } from "firebase/database";
export declare function useDatabaseSnapshot<R = DataSnapshot>(queryKey: QueryKey, ref: DatabaseReference, options?: {
    subscribe?: boolean;
}, useQueryOptions?: Omit<UseQueryOptions<DataSnapshot, Error, R>, "queryFn">): UseQueryResult<R, Error>;
export declare type UseDatabaseValueOptions = {
    subscribe?: boolean;
    toArray?: boolean;
};
export declare function useDatabaseValue<T = unknown | null, R = T>(queryKey: QueryKey, ref: DatabaseReference, options?: UseDatabaseValueOptions, useQueryOptions?: Omit<UseQueryOptions<T, Error, R>, "queryFn">): UseQueryResult<R, Error>;
