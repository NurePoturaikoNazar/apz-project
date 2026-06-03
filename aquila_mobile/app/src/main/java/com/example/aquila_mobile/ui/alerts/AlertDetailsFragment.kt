package com.example.aquila_mobile.ui.alerts

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import coil.load
import com.example.aquila_mobile.R
import com.example.aquila_mobile.data.api.RetrofitClient
import com.example.aquila_mobile.data.model.Snapshot
import com.example.aquila_mobile.databinding.FragmentAlertDetailsBinding
import kotlinx.coroutines.launch

class AlertDetailsFragment : Fragment(R.layout.fragment_alert_details) {

    private var _binding: FragmentAlertDetailsBinding? = null
    private val binding get() = _binding!!
    private val args: AlertDetailsFragmentArgs by navArgs()
    private var latestSnapshot: Snapshot? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentAlertDetailsBinding.bind(view)

        binding.toolbar.setNavigationOnClickListener { findNavController().navigateUp() }

        binding.alertTypeLabel.text = args.alertType.replace('_', ' ').capitalize()
        binding.alertMessageLabel.text = args.alertMessage
        binding.alertDeviceLabel.text = "Device ID: ${args.deviceId}"
        binding.alertTimestampLabel.text = "Timestamp: ${args.timestamp}"

        binding.viewSnapshotButton.setOnClickListener {
            latestSnapshot?.let { snapshot ->
                val action = AlertDetailsFragmentDirections.actionAlertDetailsFragmentToSnapshotDetailsFragment(
                    snapshot.imageUrl,
                    snapshot.reason,
                    snapshot.timestamp
                )
                findNavController().navigate(action)
            }
        }

        loadLatestSnapshotPreview()
    }

    private fun loadLatestSnapshotPreview() {
        lifecycleScope.launch {
            try {
                val snapshots = RetrofitClient.apiService.getSnapshots(args.deviceId)
                if (snapshots.isNotEmpty()) {
                    val latest = snapshots[0]
                    latestSnapshot = latest
                    binding.snapshotPreviewCard.visibility = View.VISIBLE
                    binding.snapshotPreviewImage.load(latest.imageUrl)
                    binding.snapshotPreviewReason.text = latest.reason.replace('_', ' ').capitalize()
                    binding.snapshotPreviewTimestamp.text = "Captured: ${latest.timestamp}"
                    binding.viewSnapshotButton.isEnabled = true
                } else {
                    binding.viewSnapshotButton.text = "No snapshot available"
                    binding.viewSnapshotButton.isEnabled = false
                }
            } catch (_: Exception) {
                binding.viewSnapshotButton.text = "Snapshot unavailable"
                binding.viewSnapshotButton.isEnabled = false
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
