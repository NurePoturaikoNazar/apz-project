package com.example.aquila_mobile.ui.alerts

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.aquila_mobile.R
import com.example.aquila_mobile.data.api.RetrofitClient
import com.example.aquila_mobile.databinding.FragmentAlertsBinding
import com.example.aquila_mobile.utils.SessionManager
import kotlinx.coroutines.launch

class AlertsFragment : Fragment(R.layout.fragment_alerts) {
    private var _binding: FragmentAlertsBinding? = null
    private val binding get() = _binding!!
    private lateinit var alertAdapter: AlertAdapter

    private val notificationChannelId = "aquila_alerts_channel"

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentAlertsBinding.bind(view)

        setupRecyclerView()
        loadAlerts()
    }

    private fun setupRecyclerView() {
        alertAdapter = AlertAdapter(emptyList()) { alert -> openAlertDetails(alert) }
        binding.alertsRecyclerView.apply {
            adapter = alertAdapter
            layoutManager = LinearLayoutManager(context)
        }
    }

    private fun loadAlerts() {
        val sessionManager = SessionManager(requireContext())
        val role = sessionManager.getUserRole()
        val currentUserId = sessionManager.getUserId()

        lifecycleScope.launch {
            try {
                val alerts = if (role == "admin") {
                    RetrofitClient.apiService.getAlerts()
                } else if (currentUserId != null) {
                    RetrofitClient.apiService.getAlerts(currentUserId)
                } else {
                    emptyList()
                }

                alertAdapter.updateAlerts(alerts)
                if (sessionManager.isNotificationsEnabled()) {
                    createNotificationChannel()
                    alerts.filter { !it.isRead }.forEach { sendAlertNotification(it) }
                }
            } catch (e: Exception) {
                Log.e("AlertsFragment", "Failed to load alerts", e)
            }
        }
    }

    private fun openAlertDetails(alert: com.example.aquila_mobile.data.model.Alert) {
        val action = AlertsFragmentDirections.actionAlertsFragmentToAlertDetailsFragment(
            alert.id.toString(),
            alert.deviceId,
            alert.type,
            alert.message,
            alert.timestamp
        )
        findNavController().navigate(action)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "System Alerts"
            val descriptionText = "Notifications for active system alerts"
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(notificationChannelId, name, importance).apply {
                description = descriptionText
            }
            val notificationManager: NotificationManager = requireContext().getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun sendAlertNotification(alert: com.example.aquila_mobile.data.model.Alert) {
        val builder = NotificationCompat.Builder(requireContext(), notificationChannelId)
            .setSmallIcon(R.drawable.ic_alerts)
            .setContentTitle(alert.type.replace('_', ' ').capitalize())
            .setContentText(alert.message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)

        with(NotificationManagerCompat.from(requireContext())) {
            notify(alert.id.hashCode(), builder.build())
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
