package com.example.aquila_mobile.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class User(
    val id: String,
    val email: String,
    @Json(name = "full_name") val fullName: String,
    val role: String? = "user",
    @Json(name = "is_blocked") val isBlocked: Boolean = false
)

@JsonClass(generateAdapter = true)
data class LoginResponse(
    val token: String,
    val user: User
)
