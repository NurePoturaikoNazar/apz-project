package com.example.aquila_mobile.ui.dashboard

import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.GridLayoutManager
import com.example.aquila_mobile.R
import com.example.aquila_mobile.data.api.RetrofitClient
import com.example.aquila_mobile.databinding.FragmentDashboardBinding
import com.example.aquila_mobile.utils.SessionManager
import kotlinx.coroutines.launch

class DashboardFragment : Fragment(R.layout.fragment_dashboard) {

    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!
    private lateinit var roomAdapter: RoomAdapter

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentDashboardBinding.bind(view)

        setupRecyclerView()
        setupAdminUi()
        loadDashboardData()
    }

    private fun setupAdminUi() {
        val sessionManager = SessionManager(requireContext())
        if (sessionManager.getUserRole() == "admin") {
            binding.addNodeFab.visibility = View.VISIBLE
            binding.addNodeFab.setOnClickListener {
                findNavController().navigate(R.id.adminProvisioningFragment)
            }
        }
    }

    private fun setupRecyclerView() {
        roomAdapter = RoomAdapter(emptyList()) { room ->
            val action = DashboardFragmentDirections.actionDashboardFragmentToRoomDetailsFragment(room.id)
            findNavController().navigate(action)
        }
        binding.roomsRecyclerView.apply {
            adapter = roomAdapter
            layoutManager = GridLayoutManager(context, 2)
        }
    }

    private fun loadDashboardData() {
        val sessionManager = SessionManager(requireContext())
        val userRole = sessionManager.getUserRole()
        val userId = sessionManager.getUserId()

        lifecycleScope.launch {
            try {
                val rooms = RetrofitClient.apiService.getRooms()
                val visibleRooms = if (userRole == "admin") {
                    rooms
                } else {
                    rooms.filter { it.userId == userId }
                }

                Log.d("DashboardFragment", "Loaded visible rooms: ${visibleRooms.size}")

                if (visibleRooms.isEmpty()) {
                    binding.roomsRecyclerView.visibility = View.GONE
                    binding.emptyStateLayout.visibility = View.VISIBLE
                    binding.emptyStateText.text = if (userRole == "admin") {
                        "No nodes detected. Provision a system to start monitoring."
                    } else {
                        "No assigned rooms yet. Contact your administrator to assign your room."
                    }
                    binding.provisionFirstButton.visibility = if (userRole == "admin") View.VISIBLE else View.GONE
                    binding.provisionFirstButton.setOnClickListener {
                        findNavController().navigate(R.id.adminProvisioningFragment)
                    }
                } else {
                    binding.roomsRecyclerView.visibility = View.VISIBLE
                    binding.emptyStateLayout.visibility = View.GONE
                    roomAdapter.updateRooms(visibleRooms)
                }
                binding.shimmerView.stopShimmer()
                binding.shimmerView.visibility = View.GONE
            } catch (e: Exception) {
                Log.e("DashboardFragment", "Failed to load rooms", e)
                binding.roomsRecyclerView.visibility = View.GONE
                binding.emptyStateLayout.visibility = View.VISIBLE
                binding.emptyStateText.text = "Cannot load rooms right now. Please retry later."
                binding.provisionFirstButton.visibility = if (userRole == "admin") View.VISIBLE else View.GONE
                binding.provisionFirstButton.setOnClickListener {
                    findNavController().navigate(R.id.adminProvisioningFragment)
                }
                binding.shimmerView.stopShimmer()
                binding.shimmerView.visibility = View.GONE
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
