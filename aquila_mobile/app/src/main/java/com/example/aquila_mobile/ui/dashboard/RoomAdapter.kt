package com.example.aquila_mobile.ui.dashboard

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.aquila_mobile.data.model.Room
import com.example.aquila_mobile.databinding.ItemRoomBinding

class RoomAdapter(
    private var rooms: List<Room>,
    private val onRoomClick: (Room) -> Unit
) : RecyclerView.Adapter<RoomAdapter.RoomViewHolder>() {

    class RoomViewHolder(val binding: ItemRoomBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RoomViewHolder {
        val binding = ItemRoomBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return RoomViewHolder(binding)
    }

    override fun onBindViewHolder(holder: RoomViewHolder, position: Int) {
        val room = rooms[position]
        holder.binding.roomName.text = room.name
        holder.binding.roomType.text = room.type.replace("_", " ")

        val temp = room.averageMetrics?.get("temperature")
        val latestLastSeen = room.devices
            ?.mapNotNull { it.lastSeen }
            ?.maxOrNull()

        if (temp == null) {
            holder.binding.tempMetric.setTextColor(0x4DFFFFFF) // Dimmed text
            holder.binding.lastUpdatedText.text = latestLastSeen?.let { "Updated: ${formatLastSeen(it)}" } ?: "No updates yet"
        } else {
            holder.binding.tempMetric.text = "${temp.toInt()}°C"
            holder.binding.tempMetric.setTextColor(0xFF00D1FF.toInt()) // Electric Blue
            holder.binding.lastUpdatedText.text = latestLastSeen?.let { "Updated: ${formatLastSeen(it)}" } ?: "Live"
        }

        holder.binding.root.setOnClickListener { onRoomClick(room) }
    }

    private fun formatLastSeen(lastSeen: String): String {
        return try {
            val cleaned = lastSeen.replace('T', ' ').replace("Z", "")
            val timePart = cleaned.split(' ').getOrNull(1)
            if (timePart != null && timePart.length >= 5) {
                timePart.substring(0, 5)
            } else cleaned.takeIf { it.isNotEmpty() } ?: ""
        } catch (e: Exception) {
            lastSeen
        }
    }

    override fun getItemCount() = rooms.size

    fun updateRooms(newRooms: List<Room>) {
        rooms = newRooms
        notifyDataSetChanged()
    }
}
