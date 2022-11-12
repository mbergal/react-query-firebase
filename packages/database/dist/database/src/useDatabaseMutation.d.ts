import { UseMutationOptions, UseMutationResult } from "react-query";
import { DatabaseReference, TransactionOptions, TransactionResult } from "@firebase/database";
export declare type UseDatabaseSetMutationOptions = {
    priority?: string | number | null;
};
export declare function useDatabaseSetMutation<T = unknown>(ref: DatabaseReference, options?: UseDatabaseSetMutationOptions, useMutationOptions?: UseMutationOptions<void, Error, T>): UseMutationResult<void, Error, T>;
declare type UpdateValues = Record<string, unknown>;
export declare function useDatabaseUpdateMutation<T extends UpdateValues = UpdateValues>(ref: DatabaseReference, useMutationOptions?: UseMutationOptions<void, Error, T>): UseMutationResult<void, Error, T>;
export declare function useDatabaseRemoveMutation(ref: DatabaseReference, useMutationOptions?: UseMutationOptions<void, Error, void>): UseMutationResult<void, Error, void>;
export declare function useDatabaseTransaction<T = any>(ref: DatabaseReference, transactionUpdate: (currentData: T | null) => unknown, options?: TransactionOptions, useMutationOptions?: UseMutationOptions<TransactionResult, Error, void>): UseMutationResult<TransactionResult, Error, void>;
export {};
