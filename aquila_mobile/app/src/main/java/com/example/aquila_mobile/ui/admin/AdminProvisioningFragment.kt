package com.example.aquila_mobile.ui.admin

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.example.aquila_mobile.R
import com.example.aquila_mobile.data.api.RetrofitClient
import com.example.aquila_mobile.databinding.FragmentAdminProvisioningBinding
import kotlinx.coroutines.launch

class AdminProvisioningFragment : Fragment(R.layout.fragment_admin_provisioning) {

    private var _binding: FragmentAdminProvisioningBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentAdminProvisioningBinding.bind(view)

        binding.toolbar.setNavigationOnClickListener { findNavController().navigateUp() }

        binding.deploySystemButton.setOnClickListener {
            performDeployment()
        }
    }

    private fun performDeployment() {
        val userName = binding.userFullNameInput.text.toString()
        val userEmail = binding.userEmailInput.text.toString()
        val userPass = binding.userPasswordInput.text.toString()

        val roomName = binding.roomNameInput.text.toString()
        val roomType = binding.roomTypeInput.text.toString()

        val deviceName = binding.deviceNameInput.text.toString()
        val macAddr = binding.macAddressInput.text.toString()

        if (userName.isEmpty() || userEmail.isEmpty() || userPass.isEmpty() ||
            roomName.isEmpty() || deviceName.isEmpty() || macAddr.isEmpty()) {
            Toast.makeText(context, "All fields are mandatory for deployment", Toast.LENGTH_SHORT).show()
            return
        }

        binding.deploySystemButton.isEnabled = false
        binding.loadingBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                // 1. Create User
                val userResponse = RetrofitClient.apiService.register(mapOf(
                    "fullName" to userName,
                    "email" to userEmail,
                    "password" to userPass
                ))

                if (!userResponse.isSuccessful) {
                    throw Exception("User creation failed: ${userResponse.message()}")
                }
                val createdUser = userResponse.body()!!

                // 2. Create Room
                val roomResponse = RetrofitClient.apiService.createRoom(mapOf(
                    "userId" to createdUser.id,
                    "name" to roomName,
                    "type" to roomType,
                    "description" to "Provisioned via Admin Panel"
                ))

                if (!roomResponse.isSuccessful) {
                    throw Exception("Room creation failed")
                }
                
                // For simplicity, we fetch rooms to get the newly created room's ID 
                // In a real API, the createRoom should return the object
                val rooms = RetrofitClient.apiService.getRooms()
                val targetRoom = rooms.find { it.name == roomName } ?: throw Exception("Room not found after creation")

                // 3. Register Device
                val deviceResponse = RetrofitClient.apiService.registerDevice(mapOf(
                    "roomId" to targetRoom.id,
                    "name" to deviceName,
                    "macAddress" to macAddr,
                    "type" to "ESP32"
                ))

                if (deviceResponse.isSuccessful) {
                    Toast.makeText(context, "System Deployed Successfully!", Toast.LENGTH_LONG).show()
                    findNavController().navigateUp()
                } else {
                    throw Exception("Device registration failed")
                }

            } catch (e: Exception) {
                Toast.makeText(context, "Deployment Error: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                binding.deploySystemButton.isEnabled = true
                binding.loadingBar.visibility = View.GONE
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
