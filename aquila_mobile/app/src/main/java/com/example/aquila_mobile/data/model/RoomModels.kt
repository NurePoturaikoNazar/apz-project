package com.example.aquila_mobile.data.model

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Room(
    val id: String,
    val userId: String,
    val name: String,
    val type: String,
    val description: String?,
    val averageMetrics: Map<String, Double>? = null
)
