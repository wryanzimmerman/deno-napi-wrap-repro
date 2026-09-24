#include <node_api.h>

static uint32_t finalized = 0;

static void finalize(napi_env env, void *data, void *hint) { finalized++; }

static napi_value make_wrapped(napi_env env, napi_callback_info info) {
  napi_value obj;
  napi_create_object(env, &obj);
  napi_wrap(env, obj, NULL, finalize, NULL, NULL);
  return obj;
}

static napi_value finalized_count(napi_env env, napi_callback_info info) {
  napi_value result;
  napi_create_uint32(env, finalized, &result);
  return result;
}

NAPI_MODULE_INIT() {
  napi_value fn;
  napi_create_function(env, NULL, 0, make_wrapped, NULL, &fn);
  napi_set_named_property(env, exports, "makeWrapped", fn);
  napi_create_function(env, NULL, 0, finalized_count, NULL, &fn);
  napi_set_named_property(env, exports, "finalizedCount", fn);
  return exports;
}
