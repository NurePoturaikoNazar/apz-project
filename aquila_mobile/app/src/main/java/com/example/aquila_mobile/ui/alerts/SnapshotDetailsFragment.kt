package com.example.aquila_mobile.ui.alerts

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import coil.load
import com.example.aquila_mobile.R
import com.example.aquila_mobile.databinding.FragmentSnapshotDetailsBinding

class SnapshotDetailsFragment : Fragment(R.layout.fragment_snapshot_details) {

    private var _binding: FragmentSnapshotDetailsBinding? = null
    private val binding get() = _binding!!
    private val args: SnapshotDetailsFragmentArgs by navArgs()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentSnapshotDetailsBinding.bind(view)

        binding.toolbar.setNavigationOnClickListener { findNavController().navigateUp() }
        binding.snapshotImage.load(args.imageUrl)
        binding.snapshotReason.text = args.reason
        binding.snapshotTimestamp.text = "Timestamp: ${args.timestamp}"
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
