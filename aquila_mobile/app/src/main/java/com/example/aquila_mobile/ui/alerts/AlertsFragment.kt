package com.example.aquila_mobile.ui.alerts

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import com.example.aquila_mobile.R
import com.example.aquila_mobile.databinding.FragmentAlertsBinding

class AlertsFragment : Fragment(R.layout.fragment_alerts) {
    private var _binding: FragmentAlertsBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentAlertsBinding.bind(view)
        // Load alerts logic here
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
