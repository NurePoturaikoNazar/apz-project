package com.example.aquila_mobile.ui.alerts

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.aquila_mobile.data.model.Alert
import com.example.aquila_mobile.databinding.ItemAlertBinding

class AlertAdapter(
    private var alerts: List<Alert>,
    private val onAlertClick: (Alert) -> Unit
) : RecyclerView.Adapter<AlertAdapter.AlertViewHolder>() {

    class AlertViewHolder(val binding: ItemAlertBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AlertViewHolder {
        val binding = ItemAlertBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return AlertViewHolder(binding)
    }

    override fun onBindViewHolder(holder: AlertViewHolder, position: Int) {
        val alert = alerts[position]
        holder.binding.alertType.text = alert.type.replace('_', ' ').capitalize()
        holder.binding.alertMessage.text = alert.message
        holder.binding.alertTime.text = formatTime(alert.timestamp)
        holder.binding.alertCard.alpha = if (alert.isRead) 0.75f else 1f
        holder.binding.root.setOnClickListener { onAlertClick(alert) }
    }

    override fun getItemCount() = alerts.size

    fun updateAlerts(newAlerts: List<Alert>) {
        alerts = newAlerts
        notifyDataSetChanged()
    }

    private fun formatTime(timestamp: String): String {
        val parts = timestamp.split('T')
        val date = parts.getOrNull(0) ?: timestamp
        val time = parts.getOrNull(1)?.take(5) ?: "--:--"
        return "$date $time"
    }
}
