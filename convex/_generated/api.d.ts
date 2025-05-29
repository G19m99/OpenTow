/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as core_permissions from "../core/permissions.js";
import type * as core_tenant from "../core/tenant.js";
import type * as features_tenants_mutations from "../features/tenants/mutations.js";
import type * as features_users_mutations from "../features/users/mutations.js";
import type * as features_users_queries from "../features/users/queries.js";
import type * as http from "../http.js";
import type * as lib_invites from "../lib/invites.js";
import type * as lib_tenant from "../lib/tenant.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "core/permissions": typeof core_permissions;
  "core/tenant": typeof core_tenant;
  "features/tenants/mutations": typeof features_tenants_mutations;
  "features/users/mutations": typeof features_users_mutations;
  "features/users/queries": typeof features_users_queries;
  http: typeof http;
  "lib/invites": typeof lib_invites;
  "lib/tenant": typeof lib_tenant;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
