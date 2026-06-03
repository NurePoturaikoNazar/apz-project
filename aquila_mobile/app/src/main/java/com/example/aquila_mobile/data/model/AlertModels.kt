package com.example.aquila_mobile.data.model

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Alert(
    val id: String,
    val deviceId: String,
    val type: String,
    val message: String,
    val isRead: Boolean,
    val timestamp: String
)

@JsonClass(generateAdapter = true)
data class Snapshot(
    val id: String,
    val deviceId: String,
    val imageUrl: String,
    val reason: String,
    val timestamp: String
)
