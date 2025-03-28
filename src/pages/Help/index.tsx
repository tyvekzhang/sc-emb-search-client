"use client"

import type React from "react"
import { GridContent } from "@ant-design/pro-components"
import { Anchor, BackTop, Button, Layout, Typography } from "antd"
import { ArrowUpOutlined } from "@ant-design/icons"
import { memo, useEffect, useState, useRef } from "react"

const { Title, Paragraph } = Typography
const { Content } = Layout;
const { Link } = Anchor

// Map of section IDs to their corresponding video sources
const sectionVideoMap: { [key: string]: string } = {
  Home: "/Home.mp4",
  Dataset: "/Dataset.mp4",
  Search: "/Search.mp4",
}

const HelpPage: React.FC = memo(() => {
  const [currentVideo, setCurrentVideo] = useState(sectionVideoMap.Home)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activeSection, setActiveSection] = useState("Introduction")

  // Handle hash change for direct links
  function handleHashEvent() {
    const hash = window.location.hash
    if (hash) {
      const sectionId = hash.substring(1)
      const element = document.getElementById(sectionId)
      if (element) {
        setTimeout(() => {
          const top = element.offsetTop
          window.scrollTo({ top: top, behavior: "smooth" })
          updateVideoSource(sectionId)
        }, 500)
      }
    }
  }

  // Update video source based on section ID
  const updateVideoSource = (sectionId: string) => {
    if (sectionVideoMap[sectionId]) {
      setCurrentVideo(sectionVideoMap[sectionId])
      setActiveSection(sectionId)
    }
  }

  // Check which section is in view during scrolling
  const handleScroll = () => {
    const sections = ["Home", "Dataset", "Search"]

    // Find which section is currently most visible in the viewport
    let currentSectionId = activeSection
    let maxVisibleHeight = 0

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        const rect = element.getBoundingClientRect()
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)

        if (visibleHeight > maxVisibleHeight && visibleHeight > 0) {
          maxVisibleHeight = visibleHeight
          currentSectionId = sectionId
        }
      }
    })

    // Only update if the section has changed
    if (currentSectionId !== activeSection) {
      updateVideoSource(currentSectionId)
    }
  }

  useEffect(() => {
    handleHashEvent()
    window.addEventListener("hashchange", handleHashEvent)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("hashchange", handleHashEvent)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeSection])

  // Handle anchor link clicks
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: HTMLAnchorElement) => {
    e.preventDefault()
    const sectionId = link.href.split("#")[1]
    updateVideoSource(sectionId)

    const element = document.getElementById(sectionId)
    if (element) {
      const top = element.offsetTop
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <GridContent>
      <div className="relative flex">
        {/* Fixed sidebar */}
        <div className="fixed left-[calc((100vw-1200px)/2)]] top-[60px] h-screen w-[180px] bg-gray-50 z-20">
          <div className="h-full overflow-y-auto py-4">
            <Anchor
              affix={false}
              targetOffset={70}
              onClick={handleAnchorClick as any}
              getCurrentAnchor={() => `#${activeSection}`}
              className="px-4 bg-gray-50"
            >
              <Link href="#Home" title="Home" />
              <Link href="#Dataset" title="Dataset" />
              <Link href="#Search" title="Search" />
              <Link href="#Contact us" title="Contact us" />
              <Link href="#Copyright" title="Copyright" />
            </Anchor>
          </div>
        </div>

        {/* Main content with left margin to account for fixed sidebar */}
        <div className="flex-1 ml-[180px]">
          {/* Fixed video container */}
          <div className="fixed z-10 w-[480px] right-[calc((100vw-1200px)/2)] h-[400px] top-[100px]">
            <video
              id="video"
              ref={videoRef}
              className="w-full"
              controls
              key={currentVideo} // Key changes force remount of video element
              src={currentVideo}
            />
          </div>

          {/* Scrollable content */}
          <Content className="px-8 py-6 min-h-[280px]">
            <Typography className="max-w-[490px]">
              <Title id="Home">Home</Title>
              <Paragraph>
                This page displays basic information about the ScEmbSearch, including:
                <div>(1) Introduction to the website;</div>
                <div>(2) Navigation menu;</div>
                <div>(3) Bilingual switching between Chinese and English;</div>
              </Paragraph>

              <Title id="Dataset">Dataset</Title>
              <Paragraph>
                We can filter out interested samples as needed, view, download samples and sample information,
                including:
                <div>(1) Perform pagination queries based on species, organization, and sample name;</div>
                <div>(2) Export metadata information;</div>
                <div>(3) View the details of the sample;</div>
                <div>(4) Download samples locally;</div>
                <div>(5) Only display fields of interest;</div>
              </Paragraph>

              <Title id="Search">Search</Title>
              <Paragraph>
                Select models and input files for similarity retrieval, including:
                <div>
                  (1) Submit job: We can choose the model, species, use built-in or uploaded files, search for
                  similarity results, select the barcode or cell index of interest, and fill in a custom task name
                  before submitting a search task;
                </div>
                <div>
                  (2) View results: View the status, results, and other information of task execution on the task list
                  page Download the Embedding obtained from the large model inference, retrieve the closest single-cell
                  information, view the detailed information of the sample by jumping to NCBI, and download the
                  retrieval results;
                </div>
              </Paragraph>

              <Title id="Contact us">Contact us</Title>
              <Paragraph>
                If you have any questions, please contact us at:
                <span className="p-2">
                  <a href="mailto:guoling@zhelianglab.com" className="text-blue-500 hover:text-blue-700">
                    guoling@zhelianglab.com
                  </a>
                </span>
              </Paragraph>
              <Title id="Copyright">Copyright</Title>
              <Paragraph>
                Copyright © 2025 ZheJiangLab. All Rights Reserved.
              </Paragraph>
            </Typography>
          </Content>
        </div>
      </div>

      <BackTop>
        <Button type="primary" shape="circle" icon={<ArrowUpOutlined />} />
      </BackTop>
    </GridContent>
  )
})

export default HelpPage

