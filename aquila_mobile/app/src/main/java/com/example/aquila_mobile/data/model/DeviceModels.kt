package com.example.aquila_mobile.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Device(
    val id: String,
    val roomId: String,
    val name: String,
    val macAddress: String,
    val type: String,
    @Json(name = "is_active") val isActive: Boolean,
    @Json(name = "last_seen") val lastSeen: String? = null
)

@JsonClass(generateAdapter = true)
data class Telemetry(
    val id: String?,
    val deviceId: String?,
    val macAddress: String?,
    val temperature: Double,
    val humidity: Double,
    val lightLevel: Double,
    val soundLevel: Double,
    val timestamp: String?
)
