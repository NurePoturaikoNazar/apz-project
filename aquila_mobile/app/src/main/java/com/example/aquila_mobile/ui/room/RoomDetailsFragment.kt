package com.example.aquila_mobile.ui.room

import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.example.aquila_mobile.R
import com.example.aquila_mobile.utils.SessionManager
import com.example.aquila_mobile.data.api.RetrofitClient
import com.example.aquila_mobile.databinding.FragmentRoomDetailsBinding
import kotlinx.coroutines.launch

class RoomDetailsFragment : Fragment(R.layout.fragment_room_details) {

    private var _binding: FragmentRoomDetailsBinding? = null
    private val binding get() = _binding!!
    
    private val args: RoomDetailsFragmentArgs by navArgs()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentRoomDetailsBinding.bind(view)
        
        binding.toolbar.setNavigationOnClickListener { findNavController().navigateUp() }
        
        val sessionManager = SessionManager(requireContext())
        if (sessionManager.getUserRole() != "admin") {
            binding.systemInfoTitle.visibility = View.GONE
            binding.systemInfoCard.visibility = View.GONE
        }

        Log.d("RoomDetailsFragment", "Navigated with roomId=${args.roomId}")
        loadRoomData()
    }

    private fun loadRoomData() {
        val roomId = args.roomId
        lifecycleScope.launch {
            try {
                // 1. Get Room Info
                val room = RetrofitClient.apiService.getRoomById(roomId)
                binding.roomNameLabel.text = "Room: ${room.name}"
                binding.roomTypeLabel.text = "Type: ${room.type.replace("_", " ")}"
                
                // 2. Get User Info
                val user = RetrofitClient.apiService.getUserById(room.userId)
                binding.assignedUserLabel.text = "Assigned User: ${user.fullName}"

                // 3. Use devices from room object
                val roomDevices = room.devices ?: emptyList()
                binding.deviceInfoLabel.text = "Active Devices: ${roomDevices.size}"

                if (roomDevices.isNotEmpty()) {
                    val primaryDevice = roomDevices[0]
                    // We can use primaryDevice.id or fetch by MAC if needed
                    val telemetry = RetrofitClient.apiService.getDeviceTelemetry(primaryDevice.id, limit = 1)
                    if (telemetry.isNotEmpty()) {
                        val latest = telemetry[0]
                        binding.tempText.text = "${latest.temperature.toInt()}°C"
                        binding.humidityText.text = "${latest.humidity.toInt()}%"
                        binding.lightText.text = "${latest.lightLevel.toInt()} lx"
                        binding.noiseText.text = "${latest.soundLevel.toInt()} dB"
                    }
                }

            } catch (e: Exception) {
                // Handle or log error
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
