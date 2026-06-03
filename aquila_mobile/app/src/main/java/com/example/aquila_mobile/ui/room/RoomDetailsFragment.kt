package com.example.aquila_mobile.ui.room

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.example.aquila_mobile.R
import com.example.aquila_mobile.databinding.FragmentRoomDetailsBinding

class RoomDetailsFragment : Fragment(R.layout.fragment_room_details) {

    private var _binding: FragmentRoomDetailsBinding? = null
    private val binding get() = _binding!!
    
    private val args: RoomDetailsFragmentArgs by navArgs()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentRoomDetailsBinding.bind(view)
        
        val roomId = args.roomId
        // Load devices for room
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
