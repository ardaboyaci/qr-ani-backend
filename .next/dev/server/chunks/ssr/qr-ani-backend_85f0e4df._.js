module.exports = [
"[project]/qr-ani-backend/utils/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/qr-ani-backend/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/qr-ani-backend/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/qr-ani-backend/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://pnyrhiunybmtwdaawesc.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBueXJoaXVueWJtdHdkYWF3ZXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NjU3NjMsImV4cCI6MjA3NzA0MTc2M30.13jEz863Kxw64RZuYy8iHqM2NJ9n066Uq-aTdowwJ1M"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/qr-ani-backend/app/auth/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00c3692d36971f39c3b1a95e6c7f0eb740a48860ae":"signOut","4002190858688e049e717b6e2f8aee5c55c03eae1d":"signInWithOAuth"},"",""] */ __turbopack_context__.s([
    "signInWithOAuth",
    ()=>signInWithOAuth,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/qr-ani-backend/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/qr-ani-backend/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/qr-ani-backend/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/qr-ani-backend/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/qr-ani-backend/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/qr-ani-backend/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function signInWithOAuth(provider) {
    const origin = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])()).get('origin');
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${origin}/auth/callback?next=/dashboard`
        }
    });
    if (error) {
        console.error(error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login?message=Could not authenticate user');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(data.url);
}
async function signOut() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    await supabase.auth.signOut();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    signInWithOAuth,
    signOut
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signInWithOAuth, "4002190858688e049e717b6e2f8aee5c55c03eae1d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signOut, "00c3692d36971f39c3b1a95e6c7f0eb740a48860ae", null);
}),
"[project]/qr-ani-backend/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/qr-ani-backend/app/auth/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/qr-ani-backend/app/auth/actions.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/qr-ani-backend/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/qr-ani-backend/app/auth/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00c3692d36971f39c3b1a95e6c7f0eb740a48860ae",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOut"],
    "4002190858688e049e717b6e2f8aee5c55c03eae1d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signInWithOAuth"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$qr$2d$ani$2d$backend$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/qr-ani-backend/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/qr-ani-backend/app/auth/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$qr$2d$ani$2d$backend$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/qr-ani-backend/app/auth/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=qr-ani-backend_85f0e4df._.js.map