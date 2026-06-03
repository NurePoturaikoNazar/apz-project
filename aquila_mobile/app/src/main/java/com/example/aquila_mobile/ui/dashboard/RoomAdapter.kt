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
        holder.binding.roomType.text = room.type
        
        // Example metric display
        val temp = room.averageMetrics?.get("temperature") ?: "--"
        holder.binding.tempMetric.text = "${temp}°C"

        holder.root.setOnClickListener { onRoomClick(room) }
    }

    override fun getItemCount() = rooms.size

    fun updateRooms(newRooms: List<Room>) {
        rooms = newRooms
        notifyDataSetChanged()
    }
}
