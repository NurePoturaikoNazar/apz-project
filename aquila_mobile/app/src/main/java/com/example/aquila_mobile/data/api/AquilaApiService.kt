package com.example.aquila_mobile.data.api

import com.example.aquila_mobile.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface AquilaApiService {

    // --- Users ---
    @POST("/api/users/login")
    suspend fun login(@Body body: Map<String, String>): Response<LoginResponse>

    @POST("/api/users/register")
    suspend fun register(@Body body: Map<String, String>): Response<User>

    @GET("/api/users")
    suspend fun getUsers(): List<User>

    @GET("/api/users/{id}")
    suspend fun getUserById(@Path("id") id: String): User

    // --- Rooms ---
    @GET("/api/rooms")
    suspend fun getRooms(): List<Room>

    @POST("/api/rooms")
    suspend fun createRoom(@Body body: Map<String, String>): Response<Void>

    @GET("/api/rooms/{id}")
    suspend fun getRoomById(@Path("id") id: String): Room

    @DELETE("/api/rooms/{id}")
    suspend fun deleteRoom(@Path("id") id: String): Response<Void>

    // --- Devices ---
    @GET("/api/devices")
    suspend fun getDevices(): List<Device>

    @POST("/api/devices")
    suspend fun registerDevice(@Body body: Map<String, String>): Response<Void>

    @GET("/api/devices/{id}")
    suspend fun getDeviceById(@Path("id") id: String): Device

    @GET("/api/devices/{deviceId}/telemetry")
    suspend fun getDeviceTelemetry(
        @Path("deviceId") deviceId: String,
        @Query("limit") limit: Int = 20
    ): List<Telemetry>

    // --- Alerts & Snapshots ---
    @GET("/api/alerts")
    suspend fun getAlerts(): List<Alert>

    @GET("/api/alerts/unread")
    suspend fun getUnreadAlerts(): List<Alert>

    @PUT("/api/alerts/{id}/read")
    suspend fun markAlertRead(@Path("id") id: String): Response<Void>

    @GET("/api/snapshots/{deviceId}")
    suspend fun getSnapshots(@Path("deviceId") deviceId: String): List<Snapshot>
}
