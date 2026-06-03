package com.example.aquila_mobile.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Room(
    val id: String,
    @Json(name = "user_id") val userId: String,
    val name: String,
    val type: String,
    val description: String?,
    val averageMetrics: Map<String, Double>? = null,
    val devices: List<Device>? = null
)
