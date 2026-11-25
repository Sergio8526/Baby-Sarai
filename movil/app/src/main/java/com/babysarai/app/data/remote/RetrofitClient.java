package com.babysarai.app.data.remote;

import com.babysarai.app.BuildConfig;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Crea una sola instancia de Retrofit para toda la app (patrón Singleton).
 * La URL base viene de BuildConfig.API_BASE_URL, definida en gradle.properties.
 */
public final class RetrofitClient {

    private static final int SEGUNDOS_ESPERA = 8;
    private static volatile ApiService api;

    private RetrofitClient() {
    }

    public static ApiService getApi() {
        if (api == null) {
            synchronized (RetrofitClient.class) {
                if (api == null) {
                    OkHttpClient cliente = new OkHttpClient.Builder()
                            .connectTimeout(SEGUNDOS_ESPERA, TimeUnit.SECONDS)
                            .readTimeout(SEGUNDOS_ESPERA, TimeUnit.SECONDS)
                            .build();

                    Retrofit retrofit = new Retrofit.Builder()
                            .baseUrl(BuildConfig.API_BASE_URL)
                            .client(cliente)
                            .addConverterFactory(GsonConverterFactory.create())
                            .build();

                    api = retrofit.create(ApiService.class);
                }
            }
        }
        return api;
    }
}
