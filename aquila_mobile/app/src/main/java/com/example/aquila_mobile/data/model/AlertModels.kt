package com.example.aquila_mobile.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Alert(
    val id: String,
    @Json(name = "device_id") val deviceId: String,
    val type: String,
    val message: String,
    @Json(name = "is_read") val isRead: Boolean,
    @Json(name = "created_at") val timestamp: String
)

@JsonClass(generateAdapter = true)
data class Snapshot(
    val id: String,
    @Json(name = "device_id") val deviceId: String,
    @Json(name = "image_url") val imageUrl: String,
    @Json(name = "trigger_reason") val reason: String,
    @Json(name = "created_at") val timestamp: String
)
