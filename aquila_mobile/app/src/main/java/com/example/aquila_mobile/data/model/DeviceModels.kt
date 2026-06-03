package com.example.aquila_mobile.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Device(
    val id: String,
    @Json(name = "room_id") val roomId: String,
    val name: String,
    @Json(name = "mac_address") val macAddress: String,
    val type: String,
    @Json(name = "is_active") val isActive: Boolean,
    @Json(name = "last_seen") val lastSeen: String? = null
)

@JsonClass(generateAdapter = true)
data class Telemetry(
    val id: String?,
    @Json(name = "device_id") val deviceId: String?,
    @Json(name = "mac_address") val macAddress: String?,
    val temperature: Double,
    val humidity: Double,
    @Json(name = "light_level") val lightLevel: Double,
    @Json(name = "sound_level") val soundLevel: Double,
    @Json(name = "recorded_at") val recordedAt: String?,
    val timestamp: String?
)
