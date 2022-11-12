'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var database = require('firebase/database');
var react = require('react');
var reactQuery = require('react-query');
var database$1 = require('@firebase/database');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var firestoreUnsubscribes = {};
var queryCacheSubscribes = {};
var eventCount = {};
function firestoreUnsubscribe(subscriptionHash) {
    var firestoreUnsubscribe = firestoreUnsubscribes[subscriptionHash];
    if (firestoreUnsubscribe && typeof firestoreUnsubscribe === "function") {
        firestoreUnsubscribe();
    }
    delete firestoreUnsubscribes[subscriptionHash];
    delete eventCount[subscriptionHash];
}
function queryCacheUnsubscribe(subscriptionHash) {
    var queryCacheUnsubscribe = queryCacheSubscribes[subscriptionHash];
    if (queryCacheUnsubscribe) {
        queryCacheUnsubscribe.unsubscribe();
        delete queryCacheSubscribes[subscriptionHash];
    }
}
/**
 * Utility hook to subscribe to events, given a function that returns an observer callback.
 * @param queryKey The react-query queryKey
 * @param subscriptionKey A hashable key to store the subscription
 * @param subscribeFn Returns an unsubscribe function to the event
 * @param options
 * @returns
 */
function useSubscription(queryKey, subscriptionKey, subscribeFn, options) {
    var _this = this;
    var _a;
    var hashFn = (options === null || options === void 0 ? void 0 : options.queryKeyHashFn) || reactQuery.hashQueryKey;
    var subscriptionHash = hashFn(subscriptionKey);
    var queryClient = reactQuery.useQueryClient();
    var resolvePromise = function () { return null; };
    var rejectPromise = function () { return null; };
    var result = new Promise(function (resolve, reject) {
        resolvePromise = resolve;
        rejectPromise = reject;
    });
    result.cancel = function () {
        queryClient.invalidateQueries(queryKey);
    };
    if (options === null || options === void 0 ? void 0 : options.onlyOnce) {
        if (!options.fetchFn) {
            throw new Error("You must specify fetchFn if using onlyOnce mode.");
        }
        else {
            var enabled = (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true;
            if (enabled) {
                options
                    .fetchFn()
                    .then(resolvePromise)
                    .catch(function (err) {
                    rejectPromise(err);
                });
            }
        }
    }
    else {
        var subscribedToQueryCache = !!queryCacheSubscribes[subscriptionHash];
        if (!subscribedToQueryCache) {
            var queryCache = queryClient.getQueryCache();
            var unsubscribe = queryCache.subscribe(function (event) {
                if (!event || event.query.queryHash !== hashFn(queryKey)) {
                    return;
                }
                var query = event.query, type = event.type;
                if (type === "queryRemoved") {
                    delete eventCount[subscriptionHash];
                    queryCacheUnsubscribe(subscriptionHash);
                    firestoreUnsubscribe(subscriptionHash);
                }
                if (type === "observerAdded" || type === "observerRemoved") {
                    var observersCount = query.getObserversCount();
                    if (observersCount === 0) {
                        firestoreUnsubscribe(subscriptionHash);
                    }
                    else {
                        var isSubscribedToFirestore = !!firestoreUnsubscribes[subscriptionHash];
                        if (isSubscribedToFirestore) {
                            var cachedData = queryClient.getQueryData(queryKey);
                            var hasData = !!eventCount[subscriptionHash];
                            if (hasData) {
                                resolvePromise(cachedData !== null && cachedData !== void 0 ? cachedData : null);
                            }
                        }
                        else {
                            firestoreUnsubscribes[subscriptionHash] = subscribeFn(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = eventCount[subscriptionHash]) !== null && _a !== void 0 ? _a : (eventCount[subscriptionHash] = 0);
                                    eventCount[subscriptionHash]++;
                                    if (eventCount[subscriptionHash] === 1) {
                                        resolvePromise(data || null);
                                    }
                                    else {
                                        queryClient.setQueryData(queryKey, data);
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                        }
                    }
                }
            });
            queryCacheSubscribes[subscriptionHash] = { result: result, unsubscribe: unsubscribe };
        }
        else {
            result = queryCacheSubscribes[subscriptionHash].result;
        }
    }
    var queryFn = function () {
        return result;
    };
    return reactQuery.useQuery(__assign(__assign({}, options), { queryFn: queryFn, queryKey: queryKey, retry: false, staleTime: Infinity, refetchInterval: undefined, refetchOnMount: true, refetchOnWindowFocus: false, refetchOnReconnect: false }));
}

function useDatabaseSnapshot(queryKey, ref, options, useQueryOptions) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var isSubscription = !!options.subscribe;
    var subscribeFn = react.useCallback(function (callback) {
        return database.onValue(ref, function (snapshot) {
            return callback(snapshot);
        });
    }, [ref]);
    return useSubscription(queryKey, ["useDatabaseSnapshot", queryKey], subscribeFn, __assign(__assign({}, useQueryOptions), { onlyOnce: !isSubscription, fetchFn: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, database.get(ref)];
        }); }); } }));
}
function parseDataSnapshot(snapshot, toArray) {
    if (!snapshot.exists()) {
        return null;
    }
    if (snapshot.hasChildren() && toArray) {
        var array_1 = [];
        snapshot.forEach(function (snapshot) {
            array_1.push(parseDataSnapshot(snapshot, toArray));
        });
        return array_1;
    }
    return snapshot.val();
}
function useDatabaseValue(queryKey, ref, options, useQueryOptions) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var isSubscription = !!(options === null || options === void 0 ? void 0 : options.subscribe);
    var subscribeFn = react.useCallback(function (callback) {
        return database.onValue(ref, function (snapshot) {
            var data = parseDataSnapshot(snapshot, !!(options === null || options === void 0 ? void 0 : options.toArray));
            return callback(data);
        });
    }, [ref]);
    return useSubscription(queryKey, ["useDatabaseValue", queryKey], subscribeFn, __assign(__assign({}, useQueryOptions), { onlyOnce: !isSubscription, fetchFn: function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = parseDataSnapshot;
                    return [4 /*yield*/, database.get(ref)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), !!(options === null || options === void 0 ? void 0 : options.toArray)])];
            }
        }); }); } }));
}

/*
 * Copyright (c) 2016-present Invertase Limited & Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this library except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
function useDatabaseSetMutation(ref, options, useMutationOptions) {
    return reactQuery.useMutation(function (value) {
        if ((options === null || options === void 0 ? void 0 : options.priority) !== undefined) {
            return database$1.setWithPriority(ref, value, options.priority);
        }
        return database$1.set(ref, value);
    }, useMutationOptions);
}
function useDatabaseUpdateMutation(ref, useMutationOptions) {
    return reactQuery.useMutation(function (values) {
        return database$1.update(ref, values);
    }, useMutationOptions);
}
function useDatabaseRemoveMutation(ref, useMutationOptions) {
    return reactQuery.useMutation(function () {
        return database$1.remove(ref);
    }, useMutationOptions);
}
function useDatabaseTransaction(ref, transactionUpdate, options, useMutationOptions) {
    return reactQuery.useMutation(function () {
        return database$1.runTransaction(ref, transactionUpdate, options);
    }, useMutationOptions);
}

exports.useDatabaseRemoveMutation = useDatabaseRemoveMutation;
exports.useDatabaseSetMutation = useDatabaseSetMutation;
exports.useDatabaseSnapshot = useDatabaseSnapshot;
exports.useDatabaseTransaction = useDatabaseTransaction;
exports.useDatabaseUpdateMutation = useDatabaseUpdateMutation;
exports.useDatabaseValue = useDatabaseValue;
